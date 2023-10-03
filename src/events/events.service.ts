import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { CreateEventGroupDto } from './dto/create-eventGroup.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { Action } from 'src/utils/action.enum';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  createEventGroup(createEventGroupDto: CreateEventGroupDto) {
    return 'Creating event group';
  }

  findAllEventGroups() {
    return this.prisma.eventGroup.findMany({});
  }

  createAsset(createAssetDto: CreateAssetDto) {
    return this.prisma.asset.create({ data: createAssetDto });
  }

  findAllAssets() {
    return this.prisma.asset.findMany({});
  }

  findOneAsset(uuid: string) {
    return this.prisma.asset.findUniqueOrThrow({ where: { uuid } });
  }

  updateAsset(uuid: string, updateAssetDto: UpdateAssetDto) {
    return this.prisma.asset.update({ where: { uuid }, data: updateAssetDto });
  }

  async create(createEventDto: CreateEventDto, ability: AppAbility, user) {
    // TODO fix user type
    if (!ability.can(Action.Create, 'Event')) {
      throw new ForbiddenException();
    }

    try {
      const { asset, staff, client, ...eventData } = createEventDto;
      const dataToCreate = {
        ...eventData,
        createdBy: {
          connect: { uuid: user.uuid },
        },
      };
      if (asset) {
        const { uuid } = asset;
        dataToCreate['asset'] = {
          connect: { uuid },
        };
      }
      if (staff) {
        const { uuid } = staff;
        dataToCreate['staff'] = {
          connect: { uuid },
        };
      }
      if (client) {
        const { uuid } = client;
        dataToCreate['client'] = {
          connect: { uuid },
        };
      }
      return await this.prisma.event.create({ data: dataToCreate });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(ability: AppAbility) {
    try {
      return await this.prisma.event.findMany({
        where: accessibleBy(ability).Event,
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  async findOne(uuid: string, ability: AppAbility) {
    try {
      return await this.prisma.event.findFirst({
        where: { AND: [accessibleBy(ability).Event, { uuid }] },
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  update(uuid: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${uuid} event`;
  }

  async remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'Event')) {
      throw new ForbiddenException();
    }
    return await this.prisma.event.delete({ where: { uuid } });
  }
}
