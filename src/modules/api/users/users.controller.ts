import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaParamPipe } from '../../../common/pipes';
import { FindOneParams } from '../../../utils/findOneParams.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
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
  update(@Param() { id }: FindOneParams, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ data: updateUserDto, where: { id } });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.remove({ id });
  }
}
