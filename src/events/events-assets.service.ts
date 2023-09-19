import { Body, Injectable, Param, Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/utils/exceptions/admin-route.exception';

@Injectable()
export class EventsAssetsService {
  constructor(private prisma: PrismaService) {}

  create(
    @Body() createAssetDto: CreateAssetDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;

    if (!ability.can(Action.Manage, 'all')) {
      throw new AdminRouteException();
    }
  }

  findAll() {
    return 'Find all assets';
  }

  findOne(@Param() uuid: string) {
    return `Find asset ${uuid}`;
  }

  update(@Param() uuid: string) {
    return `Update asset ${uuid}`;
  }

  remove(@Param() uuid: string) {
    return `Remove asset ${uuid}`;
  }
}
