import { ForbiddenError } from '@casl/ability';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiParamOptions,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';

import { RequestWithUser } from '../../../@types';
import JwtAuthenticationGuard from '../../../common/guards/jwt-authentication.guard';
import { ErrorsInterceptor } from '../../../common/interceptors/errors.interceptor';
import { PrismaParamPipe } from '../../../common/pipes';
import {
  badRequestOptions,
  options,
  unauthorizedOptions,
  unprocessableOptions,
  UserSwagger,
} from '../../../common/swagger';
import { notFoundOptions } from '../../../common/swagger/notFound.swagger';
import { FindOneParams } from '../../../utils/findOneParams.util';
import { Action } from '../../casl/actions.enum';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

const paramsOptions: ApiParamOptions = {
  name: 'id',
  example: Math.floor(Math.random() * 10),
  type: Number,
  description: 'ID of the user',
};

@ApiTags('users')
@ApiBadRequestResponse(badRequestOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@UseInterceptors(ErrorsInterceptor)
@UseGuards(JwtAuthenticationGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  @ApiOkResponse(options('users', 'GET', UserSwagger))
  async findAll(
    @Query(new PrismaParamPipe())
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    },
    @Req() { user }: RequestWithUser,
  ): Promise<User[]> {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, 'User');
      const users = await this.usersService.findAll(params);
      users.forEach((user) => delete user.password);
      return users;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Patch(':id')
  @ApiParam(paramsOptions)
  @ApiUnprocessableEntityResponse(unprocessableOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiOkResponse(options('users', 'PATCH', UserSwagger))
  async update(
    @Param() { id }: FindOneParams,
    @Body() updateUserDto: UpdateUserDto,
    @Req() { user }: RequestWithUser,
  ) {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, 'User');
      const userUpdated = await this.usersService.update({
        data: updateUserDto,
        where: { id: Number(id) },
      });
      delete userUpdated.password;
      return userUpdated;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiOkResponse(options('users', 'GETBYID', UserSwagger))
  async findOne(
    @Param() { id }: FindOneParams,
    @Req() { user }: RequestWithUser,
  ): Promise<User> {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, 'User');
      const userFind = await this.usersService.findOne({ id: Number(id) });
      delete userFind.password;
      return userFind;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiParam(paramsOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiNoContentResponse(options('users', 'DELETE'))
  async delete(
    @Param() { id }: FindOneParams,
    @Req() { user }: RequestWithUser,
  ) {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, 'User');
      return this.usersService.remove({ id: Number(id) });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
