import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
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
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  ): Promise<User[]> {
    const users = await this.usersService.findAll(params);
    users.forEach((user) => delete user.password);
    return users;
  }

  @Patch(':id')
  @ApiParam(paramsOptions)
  @ApiUnprocessableEntityResponse(unprocessableOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiOkResponse(options('users', 'PATCH', UserSwagger))
  async update(
    @Param() { id }: FindOneParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userUpdated = await this.usersService.update({
      data: updateUserDto,
      where: { id: Number(id) },
    });
    delete userUpdated.password;
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiOkResponse(options('users', 'GETBYID', UserSwagger))
  async findOne(@Param() { id }: FindOneParams): Promise<User> {
    const user = await this.usersService.findOne({ id: Number(id) });
    delete user.password;
    return user;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiParam(paramsOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiNoContentResponse(options('users', 'DELETE'))
  async delete(@Param() { id }: FindOneParams) {
    return this.usersService.remove({ id: Number(id) });
  }
}
