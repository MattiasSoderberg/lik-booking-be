import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('clients')
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.usersService.createClient(createClientDto);
  }

  @Get('clients')
  findAllClients() {
    return this.usersService.findAllClients();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('clients/:uuid')
  findOneClient(@Param('uuid') uuid: string) {
    return this.usersService.findOneClient(uuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.usersService.remove(uuid);
  }
}
