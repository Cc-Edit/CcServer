import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '../../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(AppConfig.JWT.header_key),
      ignoreExpiration: false,
      secretOrKey: AppConfig.JWT.secret,
    });
  }

  async validate(payload: any) {
    return { uuid: payload.uuid };
  }
}
