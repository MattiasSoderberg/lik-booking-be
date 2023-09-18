import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/auth.interface';

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

  @Get('me')
  findMe(@Request() req: AuthenticatedRequest) {
    const { ability, user } = req;
    return this.usersService.findMe(ability, user);
  }

  @Post()
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.usersService.createUser(createUserDto, ability);
  }

  @Get()
  findAllUsers(@Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.usersService.findAllUsers(ability);
  }

  @Get('clients/:uuid')
  findOneClient(@Param('uuid') uuid: string) {
    return this.usersService.findOneClient(uuid);
  }

  @Get(':uuid')
  findOneUser(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability, user } = req;

    return this.usersService.findOneUser(uuid, ability, user);
  }

  @Patch(':uuid')
  updateUser(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(uuid, updateUserDto);
  }

  @Delete(':uuid')
  removeUser(@Param('uuid') uuid: string) {
    return this.usersService.removeUser(uuid);
  }
}
