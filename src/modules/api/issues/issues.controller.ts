import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { PrismaParamPipe } from '../../../common/pipes';
import { Issue, Prisma } from '@prisma/client';
import { FindOneParams } from '../../../utils/findOneParams.util';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(@Body() createIssueDto: CreateIssueDto) {
    const data = { ...createIssueDto };
    delete data.userId;
    return this.issuesService.create({
      ...data,
      user: { connect: { id: createIssueDto.userId } },
    });
  }

  @Get()
  async findAll(
    @Query(new PrismaParamPipe())
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.IssueWhereUniqueInput;
      where?: Prisma.IssueWhereInput;
      orderBy?: Prisma.IssueOrderByWithRelationInput;
    },
  ): Promise<Issue[]> {
    return this.issuesService.findAll(params);
  }

  @Patch(':id')
  update(
    @Param() { id }: FindOneParams,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issuesService.update({ data: updateIssueDto, where: { id } });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Issue> {
    return this.issuesService.findOne({ id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.issuesService.remove({ id });
  }
}
