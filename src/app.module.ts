import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ExceptionLoggerFilter } from './filters/exception-logger.filters';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { SemestersModule } from './semesters/semesters.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_FILTER, useClass: ExceptionLoggerFilter },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  imports: [UsersModule, EventsModule, AuthModule, SemestersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
