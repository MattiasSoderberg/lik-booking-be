import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { UserExistsException } from './exceptions/user-exists.exception';
import { RoleEnum } from 'src/utils/role.enum';
import { AppAbility } from 'src/auth/auth.ability';
import { accessibleBy } from '@casl/prisma';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { ForbiddenResourceException } from 'src/auth/exceptions/forbidden-resource.exception';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto, ability: AppAbility) {
    if (!ability.can(Action.Create, 'User')) {
      throw new AdminRouteException();
    }

    const { address, role, ...userdata } = createUserDto;
    const hashedPassword = await hash(userdata.password, 10);
    userdata.password = hashedPassword;

    const dataToCreate = {
      ...userdata,
      role: { connect: { id: RoleEnum[role] } },
    };

    if (address) {
      const { street, zipCode, area } = address;
      dataToCreate['address'] = {
        connectOrCreate: {
          where: { address_identifier: { street, zipCode, area } },
          create: address,
        },
      };
    }

    try {
      const user = await this.prisma.user.create({
        data: dataToCreate,
        include: { address: true },
      });

      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        throw new UserExistsException(createUserDto.email);
      }
      throw new InternalServerErrorException(
        'Something went wrong when creating user.',
      );
    }
  }

  findMe(user: User) {
    return user;
  }

  async findAllUsers(ability: AppAbility) {
    try {
      return await this.prisma.user.findMany({
        where: accessibleBy(ability).User,
        include: { client: true },
      });
    } catch (error) {
      throw new ForbiddenResourceException();
    }
  }

  async findOneUser(uuid: string, ability: AppAbility) {
    try {
      return await this.prisma.user.findFirst({
        where: {
          AND: [accessibleBy(ability).User, { uuid }],
        },
        include: { client: { include: { assets: true } } },
      });
    } catch (error) {
      throw new ForbiddenResourceException();
    }
  }

  async findOneUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(
    uuid: string,
    updateUserDto: UpdateUserDto,
    ability: AppAbility,
  ) {
    if (!ability.can(Action.Update, 'User')) {
      throw new ForbiddenResourceException();
    }
    const { address, role, ...userData } = updateUserDto;

    const dataToUpdate = {
      ...userData,
    };

    if (role) {
      dataToUpdate['role'] = { connect: { id: RoleEnum[role] } };
    }

    if (address) {
      dataToUpdate['address'] = {
        upsert: {
          where: { uuid },
          create: address,
          update: address,
        },
      };
    }

    return await this.prisma.user.update({
      where: { uuid },
      data: dataToUpdate,
    });
  }

  async removeUser(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'User')) {
      throw new AdminRouteException();
    }
    return await `This action removes a #${uuid} user`;
  }

  async getUserWPermissions(uuid: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { uuid },
        include: { role: { include: { permissions: true } } },
      });

      return user;
    } catch (error) {
      throw new NotFoundException(`User with uuid ${uuid} not found.`);
    }
  }
}
