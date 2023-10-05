import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class SemestersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSemesterDto: CreateSemesterDto, ability: AppAbility) {
    if (!ability.can(Action.Create, 'Semester')) {
      throw new AdminRouteException();
    }

    try {
      const year = new Date(createSemesterDto.startAt).getFullYear();
      return await this.prisma.semester.create({
        data: { ...createSemesterDto, year },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        throw new BadRequestException('Semester already exists.');
      }
      throw new InternalServerErrorException(
        'Something went wrong creating semester.',
      );
    }
  }

  async findAll(ability: AppAbility) {
    try {
      return await this.prisma.semester.findMany({
        where: accessibleBy(ability).Semester,
      });
    } catch (error) {
      throw new AdminRouteException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} semester`;
  }

  update(id: number, updateSemesterDto: UpdateSemesterDto) {
    return `This action updates a #${id} semester`;
  }

  async remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'Semester')) {
      throw new AdminRouteException();
    }
    return await this.prisma.semester.delete({ where: { uuid } });
  }
}
