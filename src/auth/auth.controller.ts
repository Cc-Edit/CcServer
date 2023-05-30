import { Controller, Post, Headers, Get, Body, Session, Response, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser } from './dto/login-user.dto';
import { AllowAccess } from '../common/decorators/allow-access.decorator';
import { AppConfig } from '../../config/app.config';
import { ResultData } from '../lib/utils/result';
import * as svgCaptcha from 'svg-captcha';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAccess()
  @Post('login')
  async login(@Body() userLogin: LoginUser) {
    return ResultData.success(
      await this.authService.login(userLogin),
      '登录成功',
    );
  }

  @AllowAccess()
  @Get('captcha')
  captcha(@Response() res, @Session() session) {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 1,
      ignoreChars: '0OoLl1J8BiI9g',
      background: '#2d2d2d'
    });
    // session.captcha = captcha.text;
    res.type('svg');
    res.status(HttpStatus.OK).send(captcha.data);
  }

  @Get('logout')
  async logout(@Headers(AppConfig.JWT.header_key) token: string) {
    const auth = await this.authService.logout(token);
    return ResultData.success({}, auth ? '注销成功' : '已注销');
  }
}
