import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Issue, Prisma, User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.IssueCreateInput): Promise<Issue> {
    const createIssue = await this.prisma.issue.create({ data });
    return createIssue;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.IssueWhereUniqueInput;
    where?: Prisma.IssueWhereInput;
    orderBy?: Prisma.IssueOrderByWithRelationInput;
  }): Promise<Issue[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.issue.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    issueWhereUniqueInput: Prisma.IssueWhereUniqueInput,
  ): Promise<Issue> {
    const issue = await this.prisma.issue.findUnique({
      where: issueWhereUniqueInput,
    });

    if (!issue) {
      throw new NotFoundException();
    }
    return issue;
  }

  async update(
    params: {
      data: Prisma.IssueUpdateInput;
      where: Prisma.IssueWhereUniqueInput;
    },
    user: User,
  ) {
    const { where, data } = params;
    const issue = await this.prisma.issue.findUnique({ where });
    if (issue.userId === user.id) {
      const issueUpdated = await this.prisma.issue.update({ data, where });
      return issueUpdated;
    } else {
      if (data.status === 'APROVADO' || data.status === 'REPROVADO') {
        throw new ForbiddenException('You are not the author of the record');
      }
      const issueUpdated = await this.prisma.issue.update({ data, where });
      return issueUpdated;
    }
  }

  async remove(where: Prisma.IssueWhereUniqueInput) {
    const deleteIssue = await this.prisma.issue.delete({ where });
    return deleteIssue;
  }
}
