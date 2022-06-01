import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
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
import { FindOneParams } from '../../../utils/findOneParams.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

const paramsOptions: ApiParamOptions = {
  name: 'id',
  example: Math.floor(Math.random() * 10),
  type: Number,
  description: 'ID of the user',
};

@ApiTags('users')
@ApiUnprocessableEntityResponse(unprocessableOptions)
@ApiBadRequestResponse(badRequestOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@UseInterceptors(ErrorsInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse(options('users', 'POST', UserSwagger))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

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
    return this.usersService.findAll(params);
  }

  @Patch(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('users', 'PATCH', UserSwagger))
  update(@Param() { id }: FindOneParams, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ data: updateUserDto, where: { id } });
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('users', 'GETBYID', UserSwagger))
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @Delete(':id')
  @ApiParam(paramsOptions)
  @ApiNoContentResponse(options('users', 'DELETE'))
  async delete(@Param('id') id: number) {
    return this.usersService.remove({ id });
  }
}
