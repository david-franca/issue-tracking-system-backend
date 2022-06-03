import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../../../../@types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token =
            req.body.token || req.query.token || req.headers['x-access-token'];
          return token;
        },
      ]),
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOne({ id: payload.userId });
  }
}
