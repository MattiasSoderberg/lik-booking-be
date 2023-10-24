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
import { CreateEventGroupDto } from './dto/create-event-group.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { EventsAssetsService } from './events-assets.service';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { EventValidationPipe } from './pipes/event-validation.pipe';
import { EventGroupsService } from './event-groups.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly assetsService: EventsAssetsService,
    private readonly eventGroupsService: EventGroupsService,
  ) {}

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

  @Post('event-groups')
  createEventGroup(
    @Body() createEventGroupDto: CreateEventGroupDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.eventGroupsService.create(createEventGroupDto, ability);
  }

  @Get('event-groups')
  findAllEventGroups(@Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.eventGroupsService.findAll(ability);
  }

  @Get('event-groups/:uuid')
  findOneEventGroup(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.eventGroupsService.findOne(uuid, ability);
  }

  @Delete('event-groups/:uuid')
  deleteEventGroup(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.eventGroupsService.remove(uuid, ability);
  }

  @Post()
  create(
    @Body(EventValidationPipe) createEventDto: CreateEventDto,
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

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string, @Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.eventsService.findOne(uuid, ability);
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
}
