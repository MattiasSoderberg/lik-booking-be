import { Injectable } from '@nestjs/common';
import { AddressDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createClient(createClientDto: CreateClientDto) {
    // return this.prisma.client.create({ data: createClientDto });
    return 'client create';
  }

  findAllClients() {
    return this.prisma.client.findMany({});
  }

  findOneClient(uuid) {
    return this.prisma.client.findUniqueOrThrow({ where: { uuid } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { address, ...userdata } = createUserDto;
    const hashedPassword = await hash(userdata.password, 10);
    userdata.password = hashedPassword;

    const user = await this.prisma.user.create({
      data: { ...userdata, address: { create: address } },
      include: { address: true },
    });

    return user; // TODO remove password from return
  }

  findAllUsers() {
    return this.prisma.user.findMany({ include: { address: true } });
  }

  findOneUser(uuid: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { uuid } });
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDto) {
    const { address, ...userData } = updateUserDto;
    const user = await this.prisma.user.update({
      where: { uuid },
      data: {
        ...userData,
        address: {
          upsert: {
            where: { uuid },
            create: address,
            update: address,
          },
        },
      },
      include: { address: true },
    });
    return user;
  }

  removeUser(uuid: string) {
    return `This action removes a #${uuid} user`;
  }
}
