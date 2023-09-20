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
import { UsersClientsService } from './users-clients.service';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientsService: UsersClientsService,
  ) {}

  @Post('clients')
  createClient(
    @Body() createClientDto: CreateClientDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.clientsService.create(createClientDto, ability);
  }

  @Get('clients')
  findAllClients(@Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.clientsService.findAll(ability);
  }

  @Get('me')
  findMe(@Request() req: AuthenticatedRequest) {
    const { user } = req;
    return this.usersService.findMe(user);
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
  findOneClient(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.clientsService.findOne(uuid, ability);
  }

  @Patch('clients/:uuid')
  updateClient(
    @Param('uuid') uuid: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.clientsService.update(uuid, updateClientDto, ability);
  }

  @Patch('clients/:uuid/remove-asset')
  removeClientAsset(
    @Param('uuid') uuid: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.clientsService.removeClientAsset(
      uuid,
      updateClientDto,
      ability,
    );
  }

  @Patch('clients/:uuid/remove-relative')
  removeClientRelative(
    @Param('uuid') uuid: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.clientsService.removeClientRelative(
      uuid,
      updateClientDto,
      ability,
    );
  }

  @Delete('clients/:uuid')
  removeClient(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.clientsService.remove(uuid, ability);
  }

  @Get(':uuid')
  findOneUser(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;

    return this.usersService.findOneUser(uuid, ability);
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
