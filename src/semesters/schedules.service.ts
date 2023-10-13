import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { accessibleBy } from '@casl/prisma';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { EventsService } from 'src/events/events.service';
import { EventGroup, Prisma, Schedule, Semester } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { SemesterPlans } from 'src/utils/constants.enum';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  // TODO FIX USER TYPE
  async create(
    semesterUuid: string,
    createScheduleDto: CreateScheduleDto,
    ability: AppAbility,
    user,
  ) {
    if (!ability.can(Action.Create, 'Schedule')) {
      throw new AdminRouteException();
    }

    const { staff, client, eventGroup, asset, eventStaff, ...data } =
      createScheduleDto;
    const dataToCreate = {
      ...data,
      scheduleFor: client?.uuid || staff?.uuid,
      semester: { connect: { uuid: semesterUuid } },
    };

    // if (staff) {
    //   dataToCreate['staff'] = {
    //     connect: { ...staff },
    //   };
    // }

    if (client) {
      dataToCreate['client'] = {
        connect: { ...client },
      };
      dataToCreate['eventGroup'] = {
        connect: { ...eventGroup },
      };

      try {
        const clientSchedule = await this.prisma.schedule.create({
          data: dataToCreate,
          include: {
            client: { include: { assets: true } },
            semester: true,
            eventGroup: true,
          },
        });
        if (clientSchedule) {
          const { semester, eventGroup, client, ...rest } = clientSchedule;

          const data = await this.createEventData(
            rest,
            semester,
            eventGroup,
            client,
            eventStaff,
            asset,
          );

          const transformedData = data.map((data) => {
            const { asset, staff, client, ...eventData } = data;
            const transformedObject = {
              ...eventData,
              createdBy: {
                connect: { uuid: user.uuid },
              },
              client: {
                connect: { ...client },
              },
            };
            if (asset) {
              transformedObject['asset'] = {
                connect: { ...asset },
              };
            }
            if (staff) {
              transformedObject['staff'] = {
                connect: { ...staff },
              };
            }

            return transformedObject;
          });

          try {
            return await this.prisma.schedule.update({
              where: { uuid: clientSchedule.uuid },
              data: { events: { create: transformedData } },
              include: { events: true, eventGroup: true },
            });
          } catch (error) {
            await this.prisma.schedule.delete({
              where: { uuid: clientSchedule.uuid },
            });
            throw new InternalServerErrorException(error);
          }
        }
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error?.code === PrismaErrors.UniqueConstraintError
        ) {
          throw new BadRequestException('Client schedule already exists.');
        }
        throw new InternalServerErrorException(
          error,
          'Something went wrong when creating schedule.',
        );
      }
    }
  }

  async findAllBySemester(semesterUuid: string, ability: AppAbility) {
    return await this.prisma.schedule.findMany({
      where: {
        AND: [accessibleBy(ability).Schedule, { semesterId: semesterUuid }],
      },
    });
  }

  async remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'Schedule')) {
      throw new AdminRouteException();
    }

    return await this.prisma.schedule.delete({ where: { uuid } });
  }

  /***
   * CREATE ARRAY OF EVENT DATA OF LENGTH BASED ON SEMESTER PLAN (FULL OR HALF)
   *  ***/
  private async createEventData(
    schedule: Schedule,
    semester: Semester,
    eventGroup: EventGroup,
    client: any,
    staff: { uuid: string },
    asset: { uuid: string },
  ) {
    if (client.assets.some((a) => a.assetId !== asset.uuid)) {
      throw new BadRequestException('Asset is not included in clients assets.');
    }

    const numberOfEvents: number = SemesterPlans[schedule.semesterPlan];
    const dateInterval = schedule.semesterPlan === 'FULL' ? 7 : 14;
    const { firstEventStartAt, firstEventEndAt } =
      this.getFirstEventDateOfSemester(semester, eventGroup);

    const eventList: CreateEventDto[] = [];

    for (let i = 0; i < numberOfEvents; i++) {
      const eventData: CreateEventDto = {
        startAt: firstEventStartAt,
        endAt: firstEventEndAt,
        client: { uuid: schedule.clientId },
        staff: { ...staff },
        asset: { ...asset },
        note: `Schemalagt event nr: ${i + 1}/${numberOfEvents}`,
      };

      if (eventList[0]) {
        eventData['startAt'] = this.getNextDate(
          eventList[i - 1].startAt,
          dateInterval,
        );
        eventData['endAt'] = this.getNextDate(
          eventList[i - 1].endAt,
          dateInterval,
        );
      }

      while (
        !(await this.eventsService.checkDateAvailability(eventData, semester))
      ) {
        eventData['startAt'] = this.getNextDate(eventData.startAt, 7);
        eventData['endAt'] = this.getNextDate(eventData.endAt, 7);

        if (eventData.startAt > semester.endAt) {
          throw new BadRequestException(
            `Not enough available days for ${eventGroup.weekday} in semester.`,
          );
        }
      }

      eventList.push(eventData);
    }

    return eventList;
  }

  /***
   * GET THE FIRST DATE FROM EVENT GROUP WEEKDAY OF SEMESTER
   *  ***/
  private getFirstEventDateOfSemester(
    semester: Semester,
    eventGroup: EventGroup,
  ) {
    const { weekday } = eventGroup;
    const firstEventStartAt = new Date(semester.startAt);

    if (firstEventStartAt.getDay() !== eventGroup.weekday) {
      const currentDate = firstEventStartAt.getDay();
      const dateDifference =
        currentDate > weekday
          ? weekday - currentDate + 7
          : weekday - currentDate;

      firstEventStartAt.setUTCDate(
        firstEventStartAt.getUTCDate() + dateDifference,
      );
    }

    const firstEventEndAt = new Date(firstEventStartAt);

    firstEventStartAt.setUTCHours(
      firstEventStartAt.getUTCHours() +
        parseInt(eventGroup.startAt.split(':')[0]),
      firstEventStartAt.getUTCMinutes() +
        parseInt(eventGroup.startAt.split(':')[1]),
    );

    firstEventEndAt.setUTCHours(
      firstEventEndAt.getUTCHours() + parseInt(eventGroup.endAt.split(':')[0]),
      firstEventEndAt.getUTCMinutes() +
        parseInt(eventGroup.endAt.split(':')[1]),
    );

    return { firstEventStartAt, firstEventEndAt };
  }

  /***
   * GET THE NEXT DATE FROM PREVIOUS BASED ON A DATE INTERVAL
   *  ***/
  private getNextDate(fromDate: Date, nextDateInterval: number) {
    const nextDate = new Date(fromDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + nextDateInterval);

    return nextDate;
  }
}
