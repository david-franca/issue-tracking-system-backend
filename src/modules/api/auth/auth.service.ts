import { compare, hash } from 'bcrypt';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Environments, TokenPayload } from '../../../@types';
import { PrismaError } from '../../../common/database/prismaErrorCodes.enum';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Record<Environments, any>>,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await hash(
      registrationData.password,
      this.configService.get('SALT_NUMBER'),
    );

    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });

      delete createdUser.password;

      return createdUser;
    } catch (error) {
      if (error && error.code === PrismaError.UniqueConstraintViolation) {
        throw new ConflictException('User with that username already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async getAuthenticatedUser(
    username: string,
    plainTextPassword: string,
  ) {
    try {
      const user = await this.usersService.findOne({ username });

      await this.verifyPassword(plainTextPassword, user.password);
      delete user.password;
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
