import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return {
      isOk: true,
      message: '登录成功',
      data: await this.authService.login(req.user),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getProfile')
  getProfile(@Request() req) {
    return {
      isOk: true,
      message: '登录成功',
      data: req.user,
    };
  }
}
