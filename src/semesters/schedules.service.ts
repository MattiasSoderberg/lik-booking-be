import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateScheduleDto,
  WeekScheduleShift,
} from './dto/create-schedule.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { accessibleBy } from '@casl/prisma';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { EventsService } from 'src/events/events.service';
import {
  EventGroup,
  Prisma,
  Schedule,
  ScheduleShift,
  Semester,
} from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { SemesterPlans } from 'src/utils/constants.enum';
import { AuthenticatedUser } from 'src/auth/auth.interface';
import { Weekdays } from 'src/utils/weekdays.enum';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  async create(
    semesterUuid: string,
    createScheduleDto: CreateScheduleDto,
    ability: AppAbility,
    user: AuthenticatedUser,
  ) {
    if (!ability.can(Action.Create, 'Schedule')) {
      throw new AdminRouteException();
    }

    const {
      staff,
      client,
      eventGroup,
      asset,
      eventStaff,
      weekSchedule,
      alternativeWeekSchedule,
      ...rest
    } = createScheduleDto;
    const dataToCreate = {
      ...rest,
      scheduleFor: client?.uuid || staff?.uuid,
      semester: { connect: { uuid: semesterUuid } },
    };

    if (staff) {
      try {
        dataToCreate['staff'] = {
          connect: { ...staff },
        };
        const schedule = await this.prisma.schedule.create({
          data: dataToCreate,
          include: { semester: true },
        });

        if (schedule) {
          const { semester } = schedule;
          const scheduleShiftData = await this.createShiftData(
            user,
            schedule,
            semester,
            staff,
            weekSchedule,
            alternativeWeekSchedule,
          );

          try {
            return await this.prisma.schedule.update({
              where: { uuid: schedule.uuid },
              data: {
                scheduleShifts: {
                  create: scheduleShiftData,
                },
              },
              include: { scheduleShifts: true },
            });
          } catch (error) {
            await this.prisma.schedule.delete({
              where: { uuid: schedule.uuid },
            });
            throw new InternalServerErrorException(error?.message);
          }
        }
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error?.code === PrismaErrors.UniqueConstraintError
        ) {
          throw new BadRequestException('Staff schedule already exists.');
        }
        throw new InternalServerErrorException(
          error?.message,
          'Something went wrong when creating schedule.',
        );
      }
    }

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
   * CREATE ARRAY OF SHIFT DATA REPEATING EVERY WEEK FROM SCHEDULE START TO SCHEDULE END
   *  ***/
  private async createShiftData(
    user: AuthenticatedUser,
    schedule: Schedule,
    semester: Semester,
    staff: { uuid: string },
    weekSchedule: WeekScheduleShift[],
    alternativeWeekSchedule?: WeekScheduleShift[],
  ): Promise<ScheduleShift[]> {
    const shiftsList: ScheduleShift[] = [];

    weekSchedule.forEach(async (scheduleShift) => {
      const weekdayShiftList = [];
      const { firstEventStartAt, firstEventEndAt } =
        this.getFirstEventDateOfSemester(
          semester,
          Weekdays[scheduleShift.weekday],
          scheduleShift.startAt,
          scheduleShift.endAt,
        );
      const dateIdentifier = new Date(firstEventStartAt);
      dateIdentifier.setUTCHours(0, 0, 0, 0);
      const shiftData = {
        startAt: firstEventStartAt,
        endAt: firstEventEndAt,
        createdBy: {
          connect: { uuid: user.uuid },
        },
        userId: staff.uuid,
        dateIdentifier,
      };
      const alternativeScheduleShift =
        alternativeWeekSchedule &&
        alternativeWeekSchedule.some(
          (e) => Weekdays[e.weekday] === Weekdays[scheduleShift.weekday],
        )
          ? alternativeWeekSchedule.find(
              (e) => Weekdays[e.weekday] === Weekdays[scheduleShift.weekday],
            )
          : null;

      let currentScheduleShift = scheduleShift;

      if (
        alternativeScheduleShift &&
        this.getWeekNumber(shiftData.startAt) % 2 !== 0
      ) {
        currentScheduleShift = alternativeScheduleShift;
        shiftData['startAt'].setUTCHours(
          parseInt(currentScheduleShift.startAt.split(':')[0]),
          parseInt(currentScheduleShift.startAt.split(':')[1]),
        );
        shiftData['endAt'].setUTCHours(
          parseInt(currentScheduleShift.endAt.split(':')[0]),
          parseInt(currentScheduleShift.endAt.split(':')[1]),
        );
      }

      while (shiftData.startAt < semester.endAt) {
        if (!weekdayShiftList.length) {
          weekdayShiftList.push({ ...shiftData });
        } else {
          if (alternativeScheduleShift) {
            if (this.getWeekNumber(shiftData.startAt) % 2 === 0) {
              currentScheduleShift = alternativeScheduleShift;
            } else {
              currentScheduleShift = scheduleShift;
            }

            shiftData['startAt'] = this.getNextDate(
              weekdayShiftList[weekdayShiftList.length - 1].startAt,
              7,
              currentScheduleShift.startAt,
            );
            shiftData['endAt'] = this.getNextDate(
              weekdayShiftList[weekdayShiftList.length - 1].endAt,
              7,
              currentScheduleShift.endAt,
            );
          } else {
            shiftData['startAt'] = this.getNextDate(
              weekdayShiftList[weekdayShiftList.length - 1].startAt,
              7,
            );
            shiftData['endAt'] = this.getNextDate(
              weekdayShiftList[weekdayShiftList.length - 1].endAt,
              7,
            );
          }
          const dateIdentifier = new Date(shiftData['startAt']);
          dateIdentifier.setUTCHours(0, 0, 0, 0);
          shiftData['dateIdentifier'] = dateIdentifier;
          weekdayShiftList.push({ ...shiftData });
        }
      }

      shiftsList.push(...weekdayShiftList);
    });

    return shiftsList;
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
      this.getFirstEventDateOfSemester(
        semester,
        eventGroup.weekday,
        eventGroup.startAt,
        eventGroup.endAt,
      );

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
   * GET THE FIRST EVENT DATE OF SEMESTER
   *  ***/
  private getFirstEventDateOfSemester(
    semester: Semester,
    weekday: Weekdays,
    startTime: string,
    endTime: string,
  ) {
    const firstEventStartAt = this.getFirstDateOfWeekday(semester, weekday);

    const firstEventEndAt = new Date(firstEventStartAt);

    firstEventStartAt.setUTCHours(
      firstEventStartAt.getUTCHours() + parseInt(startTime.split(':')[0]),
      firstEventStartAt.getUTCMinutes() + parseInt(startTime.split(':')[1]),
    );

    firstEventEndAt.setUTCHours(
      firstEventEndAt.getUTCHours() + parseInt(endTime.split(':')[0]),
      firstEventEndAt.getUTCMinutes() + parseInt(endTime.split(':')[1]),
    );

    return { firstEventStartAt, firstEventEndAt };
  }

  /***
   * GET THE FIRST DATE IN DATE RANGE MATCHING WEEKDAY
   *  ***/
  private getFirstDateOfWeekday(dateRange: Semester, weekday: Weekdays) {
    const firstDate = new Date(dateRange.startAt);

    if (firstDate.getDay() !== weekday) {
      const currentDate = firstDate.getDay();
      const dateDifference =
        currentDate > weekday
          ? weekday - currentDate + 7
          : weekday - currentDate;

      firstDate.setUTCDate(firstDate.getUTCDate() + dateDifference);
    }

    return firstDate;
  }

  /***
   * GET THE NEXT DATE FROM PREVIOUS BASED ON A DATE INTERVAL
   *  ***/
  private getNextDate(
    fromDate: Date,
    nextDateInterval: number,
    militaryTime?: string,
  ) {
    const nextDate = new Date(fromDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + nextDateInterval);

    if (militaryTime) {
      const hours = parseInt(militaryTime.split(':')[0]);
      const minutes = parseInt(militaryTime.split(':')[1]);
      nextDate.setUTCHours(hours, minutes);
    }

    return nextDate;
  }

  private getWeekNumber(date: Date) {
    const daysToFirstMonday = (yearStartAt: Date) => {
      return yearStartAt.getUTCDay() < 1
        ? 1
        : yearStartAt.getUTCDay() > 1
        ? 7 - yearStartAt.getUTCDay() + 1
        : 0;
    };
    const yearStartAt = new Date(`${date.getUTCFullYear()}-01-01`);
    const dateTime = date.getTime();
    const firstWeekStartAt = new Date(yearStartAt);
    firstWeekStartAt.setUTCDate(
      yearStartAt.getUTCDate() + daysToFirstMonday(yearStartAt),
    );

    if (date < firstWeekStartAt) {
      const previousYearStartAt = new Date(
        `${yearStartAt.getUTCFullYear() - 1}-01-01`,
      );
      previousYearStartAt.setUTCDate(
        previousYearStartAt.getUTCDate() +
          daysToFirstMonday(previousYearStartAt),
      );
      firstWeekStartAt.setTime(previousYearStartAt.getTime());
    }
    const firstWeekStartTime = firstWeekStartAt.getTime();

    const timeDifference = dateTime - firstWeekStartTime;
    const weekNumber = Math.floor(timeDifference / 1000 / 3600 / 24 / 7 + 1);

    return weekNumber;
  }
}
