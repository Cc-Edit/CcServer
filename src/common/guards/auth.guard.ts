import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AppConfig } from '../../../config/app.config';

import { ALLOW_ANON } from '../decorators/allow-anon.decorator';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (allowAnon) return true;
    const req = ctx.switchToHttp().getRequest();
    const accessToken = req.get(AppConfig.Base.JWT.HEADER_KEY);
    if (!accessToken) throw new UnauthorizedException('请先登录');
    const payload = this.authService.verify(accessToken);
    if (!payload) throw new UnauthorizedException('当前登录已过期，请重新登录');
    return this.activate(ctx);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>;
  }
}
