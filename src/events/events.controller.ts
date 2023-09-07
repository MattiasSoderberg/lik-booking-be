import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateAssetDto } from './dto/create-asset.dto';
import { CreateEventGroupDto } from './dto/create-eventGroup.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('event-groups')
  createEventGroup(@Body() createEventGroupDto: CreateEventGroupDto) {
    return this.eventsService.createEventGroup(createEventGroupDto);
  }

  @Get('event-groups')
  findAllEventGroups() {
    return this.eventsService.findAllEventGroups();
  }

  @Post('assets')
  createAsset(@Body() createAssetDto: CreateAssetDto) {
    return this.eventsService.createAsset(createAssetDto);
  }

  @Get('assets')
  findAllAssets() {
    return this.eventsService.findAllAssets();
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.eventsService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(uuid, updateEventDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.eventsService.remove(uuid);
  }

  @Get('assets/:uuid')
  findOneAsset(@Param('uuid') uuid: string) {
    return this.eventsService.findOneAsset(uuid);
  }

  @Patch('assets/:uuid')
  updateAsset(
    @Param('uuid') uuid: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    return this.eventsService.updateAsset(uuid, updateAssetDto);
  }
}
