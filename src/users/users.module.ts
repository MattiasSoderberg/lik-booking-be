import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersClientsService } from './users-clients.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersClientsService],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
