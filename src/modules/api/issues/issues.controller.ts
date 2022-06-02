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
  Post,
  Query,
  Req,
  UseGuards,
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
import { Issue, Prisma, Status } from '@prisma/client';

import { RequestWithUser } from '../../../@types';
import JwtAuthenticationGuard from '../../../common/guards/jwt-authentication.guard';
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
import { Action } from '../../casl/actions.enum';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
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
@UseGuards(JwtAuthenticationGuard)
@Controller('issues')
export class IssuesController {
  constructor(
    private readonly issuesService: IssuesService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @ApiCreatedResponse(options('issues', 'POST', IssueSwagger))
  @ApiUnprocessableEntityResponse(unprocessableOptions)
  create(
    @Body() createIssueDto: CreateIssueDto,
    @Req() { user }: RequestWithUser,
  ) {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Create, 'Issue');
      const data = { ...createIssueDto };
      return this.issuesService.create({
        ...data,
        status: Status.NOVO,
        createdAt: new Date(),
        user: { connect: { id: user.id } },
      });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
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
    @Req() { user }: RequestWithUser,
  ): Promise<Issue[]> {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, 'Issue');
      return this.issuesService.findAll(params);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Patch(':id')
  @ApiParam(paramsOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiUnprocessableEntityResponse(unprocessableOptions)
  @ApiOkResponse(options('issues', 'PATCH', IssueSwagger))
  update(
    @Param() { id }: FindOneParams,
    @Body() updateIssueDto: UpdateIssueDto,
    @Req() { user }: RequestWithUser,
  ) {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, 'Issue');
      return this.issuesService.update(
        {
          data: updateIssueDto,
          where: { id: Number(id) },
        },
        user,
      );
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiNotFoundResponse(notFoundOptions)
  @ApiOkResponse(options('issues', 'GETBYID', IssueSwagger))
  async findOne(
    @Param() { id }: FindOneParams,
    @Req() { user }: RequestWithUser,
  ): Promise<Issue> {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, 'Issue');
      return this.issuesService.findOne({ id: Number(id) });
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
  @ApiNoContentResponse(options('issues', 'DELETE'))
  async delete(
    @Param() { id }: FindOneParams,
    @Req() { user }: RequestWithUser,
  ) {
    const ability = this.abilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, 'Issue');
      return this.issuesService.remove({ id: Number(id) });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
