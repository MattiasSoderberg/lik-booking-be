import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsAssetsService {
  constructor(private prisma: PrismaService) {}
}
