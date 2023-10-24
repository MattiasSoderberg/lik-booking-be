import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Payload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findOneUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Email or password is incorrect.');
    }
    await this.varifyPassword(password, user?.password);

    const { uuid, role } = user;
    const payload: Payload = { user: { uuid, role } };
    const token = { accessToken: await this.jwtService.signAsync(payload) };

    return token;
  }

  private async varifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isValidPassword = await compare(plainTextPassword, hashedPassword);
    if (!isValidPassword) {
      throw new BadRequestException('Email or password is incorrect.');
    }
  }
}
