import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiParamOptions,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Issue, Prisma } from '@prisma/client';

import { ErrorsInterceptor } from '../../../common/interceptors/errors.interceptor';
import { PrismaParamPipe } from '../../../common/pipes';
import {
  badRequestOptions,
  IssueSwagger,
  options,
  unauthorizedOptions,
  unprocessableOptions,
} from '../../../common/swagger';
import { FindOneParams } from '../../../utils/findOneParams.util';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssuesService } from './issues.service';

const paramsOptions: ApiParamOptions = {
  name: 'id',
  example: Math.floor(Math.random() * 10),
  type: Number,
  description: 'ID of the issue',
};

@ApiTags('issues')
@ApiUnprocessableEntityResponse(unprocessableOptions)
@ApiBadRequestResponse(badRequestOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@UseInterceptors(ErrorsInterceptor)
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @ApiCreatedResponse(options('issues', 'POST', IssueSwagger))
  create(@Body() createIssueDto: CreateIssueDto) {
    const data = { ...createIssueDto };
    delete data.userId;
    return this.issuesService.create({
      ...data,
      user: { connect: { id: createIssueDto.userId } },
    });
  }

  @Get()
  @ApiOkResponse(options('issues', 'GET', IssueSwagger))
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
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('issues', 'PATCH', IssueSwagger))
  update(
    @Param() { id }: FindOneParams,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issuesService.update({ data: updateIssueDto, where: { id } });
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('issues', 'GETBYID', IssueSwagger))
  async findOne(@Param('id') id: number): Promise<Issue> {
    return this.issuesService.findOne({ id });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiParam(paramsOptions)
  @ApiNoContentResponse(options('issues', 'DELETE'))
  async delete(@Param('id') id: number) {
    return this.issuesService.remove({ id });
  }
}
