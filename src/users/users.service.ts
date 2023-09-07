import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createClient(createClientDto: CreateClientDto) {
    return 'Creating client';
  }

  findAllClients() {
    return this.prisma.client.findMany({});
  }

  findOneClient(uuid) {
    return this.prisma.client.findUniqueOrThrow({ where: { uuid } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    return this.prisma.user.create({ data: createUserDto }); // TODO remove password from return
  }

  findAllUsers() {
    return this.prisma.user.findMany({});
  }

  findOneUser(uuid: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { uuid } });
  }

  updateUser(uuid: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { uuid }, data: updateUserDto });
  }

  removeUser(uuid: string) {
    return `This action removes a #${uuid} user`;
  }
}
