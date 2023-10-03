import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateAssetDto } from './dto/create-asset.dto';
import { CreateEventGroupDto } from './dto/create-eventGroup.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { EventsAssetsService } from './events-assets.service';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { DateBlockedValidationPipe } from './pipes/date-blocked-validation.pipe';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly assetsService: EventsAssetsService,
  ) {}

  @Post()
  create(
    @Body(DateBlockedValidationPipe) createEventDto: CreateEventDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability, user } = req;
    return this.eventsService.create(createEventDto, ability, user);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.eventsService.findAll(ability);
  }

  @Post('assets')
  createAsset(
    @Body() createAssetDto: CreateAssetDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.assetsService.create(createAssetDto, ability);
  }

  @Get('assets')
  findAllAssets(@Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.assetsService.findAll(ability);
  }

  @Post('event-groups')
  createEventGroup(@Body() createEventGroupDto: CreateEventGroupDto) {
    return this.eventsService.createEventGroup(createEventGroupDto);
  }

  @Get('event-groups')
  findAllEventGroups() {
    return this.eventsService.findAllEventGroups();
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
  remove(@Param('uuid') uuid: string, @Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.eventsService.remove(uuid, ability);
  }

  @Get('assets/:uuid')
  findOneAsset(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.assetsService.findOne(uuid, ability);
  }

  @Patch('assets/:uuid')
  updateAsset(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    const { ability } = req;
    return this.assetsService.update(uuid, updateAssetDto, ability);
  }

  @Delete('assets/:uuid')
  removeAsset(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.assetsService.remove(uuid, ability);
  }
}
