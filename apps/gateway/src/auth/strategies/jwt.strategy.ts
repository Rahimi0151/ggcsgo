import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';

import { AuthService } from '../auth.service';

export interface RequestWithJWT extends Request {
  user: { jwt: string };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
