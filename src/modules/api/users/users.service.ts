import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const createUser = await this.prisma.user.create({ data });
    return createUser;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { issues: true },
    });
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: { issues: true },
    });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(params: {
    data: Prisma.UserUpdateInput;
    where: Prisma.UserWhereUniqueInput;
  }) {
    const { where, data } = params;
    const userUpdated = await this.prisma.user.update({ data, where });
    return userUpdated;
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    const deleteUser = await this.prisma.user.delete({ where });
    return deleteUser;
  }
}
