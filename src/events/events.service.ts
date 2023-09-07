import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { CreateEventGroupDto } from './dto/create-eventGroup.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

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

  create(createEventDto: CreateEventDto) {
    return 'This action adds a new event';
  }

  findAll() {
    return `This action returns all events`;
  }

  findOne(uuid: string) {
    return `This action returns a #${uuid} event`;
  }

  update(uuid: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${uuid} event`;
  }

  remove(uuid: string) {
    return `This action removes a #${uuid} event`;
  }
}
