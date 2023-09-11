import { Injectable } from '@nestjs/common';
import { AddressDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createClient(createClientDto: CreateClientDto) {
    const { assets, relatives, user, ...clientData } = createClientDto;

    try {
      const client = await this.prisma.client.create({
        data: {
          ...clientData,
          relatives: {
            connectOrCreate: relatives.map((relative) => {
              return {
                where: relative,
                create: relative,
              };
            }),
          },
          assets: {
            connectOrCreate: assets.map((asset) => {
              return {
                where: asset,
                create: asset,
              };
            }),
          },
        },
        include: { relatives: true, assets: true },
      });
      return client;
    } catch (error) {
      console.error('ERROR CREATING CLIENT: ', error);
    }
  }

  findAllClients() {
    return this.prisma.client.findMany({
      include: {
        relatives: { include: { user: true } },
        assets: { include: { asset: true } },
      },
    });
  }

  findOneClient(uuid) {
    return this.prisma.client.findUniqueOrThrow({ where: { uuid } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { address, ...userdata } = createUserDto;
    const hashedPassword = await hash(userdata.password, 10);
    userdata.password = hashedPassword;

    try {
      const user = await this.prisma.user.create({
        data: { ...userdata, address: { create: address } },
        include: { address: true },
      });

      return user;
    } catch (error) {
      console.error('ERROR CREATING USER: ', error);
    }
  }

  findAllUsers() {
    return this.prisma.user.findMany({ include: { address: true } });
  }

  findOneUser(uuid: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { uuid },
      include: { address: true },
    });
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
