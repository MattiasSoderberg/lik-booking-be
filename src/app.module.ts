import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { SchedulesModule } from './schedules/schedules.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, EventsModule, SchedulesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
