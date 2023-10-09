import { Module } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  controllers: [SemestersController],
  providers: [SemestersService],
  imports: [PrismaModule, EventsModule],
})
export class SemestersModule {}
