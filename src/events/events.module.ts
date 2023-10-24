import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsAssetsService } from './events-assets.service';
import { EventGroupsService } from './event-groups.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsAssetsService, EventGroupsService],
  imports: [PrismaModule],
  exports: [EventsService],
})
export class EventsModule {}
