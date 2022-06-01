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
  ApiNotFoundResponse,
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
import { notFoundOptions } from '../../../common/swagger/notFound.swagger';
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
@ApiBadRequestResponse(badRequestOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@UseInterceptors(ErrorsInterceptor)
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @ApiCreatedResponse(options('issues', 'POST', IssueSwagger))
  @ApiUnprocessableEntityResponse(unprocessableOptions)
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
  @ApiNotFoundResponse(notFoundOptions)
  @ApiUnprocessableEntityResponse(unprocessableOptions)
  @ApiOkResponse(options('issues', 'PATCH', IssueSwagger))
  update(
    @Param() { id }: FindOneParams,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issuesService.update({
      data: updateIssueDto,
      where: { id: Number(id) },
    });
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiOkResponse(options('issues', 'GETBYID', IssueSwagger))
  async findOne(@Param() { id }: FindOneParams): Promise<Issue> {
    return this.issuesService.findOne({ id: Number(id) });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiParam(paramsOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiNoContentResponse(options('issues', 'DELETE'))
  async delete(@Param() { id }: FindOneParams) {
    return this.issuesService.remove({ id: Number(id) });
  }
}
