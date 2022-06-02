import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { RequestWithUser } from '../../../@types';
import JwtAuthenticationGuard from '../../../common/guards/jwt-authentication.guard';
import { LocalAuthenticationGuard } from '../../../common/guards/localAuthentication.guard';
import { ErrorsInterceptor } from '../../../common/interceptors/errors.interceptor';
import {
  badRequestOptions,
  options,
  unauthorizedOptions,
  unprocessableOptions,
  UserSwagger,
} from '../../../common/swagger';
import { LoginSwagger } from '../../../common/swagger/login.swagger';
import { UserWithoutIssueSwagger } from '../../../common/swagger/userWithoutIssue.swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@ApiBadRequestResponse(badRequestOptions)
@UseInterceptors(ErrorsInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse(options('users', 'POST', UserWithoutIssueSwagger))
  @ApiUnprocessableEntityResponse(unprocessableOptions)
  async create(@Body() createAuthenticationDto: RegisterDto) {
    return await this.authService.register(createAuthenticationDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiUnprocessableEntityResponse(unprocessableOptions)
  @ApiBody({ type: LoginSwagger })
  @ApiOkResponse({ type: UserSwagger, description: 'Login successfully.' })
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    delete user.password;
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @ApiUnauthorizedResponse(unauthorizedOptions)
  @ApiOkResponse({ description: 'Log-out successfully' })
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOkResponse({
    type: UserSwagger,
    description:
      'Check if the current token is valid and get the data of the currently logged in user.',
  })
  @ApiUnauthorizedResponse(unauthorizedOptions)
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    delete user.password;
    return user;
  }
}
