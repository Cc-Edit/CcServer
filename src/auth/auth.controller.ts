import { Controller, Post, Headers, Get, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser } from './dto/login-user.dto';
import { AllowAccess } from '../common/decorators/allow-access.decorator';
import { AppConfig } from '../../config/app.config';
import { ResultData } from '../lib/utils/result';
import * as svgCaptcha from 'svg-captcha';
import { GetCaptchaDto } from './dto/get-capture.dto';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAccess()
  @Post('login')
  async login(@Body() userLogin: LoginUser) {
    const captcha = AES.decrypt(
      userLogin.captureEncode,
      AppConfig.AesKey,
    ).toString(Utf8);
    if (captcha.toLowerCase() !== userLogin.captcha.toLowerCase()) {
      return ResultData.fail('验证码不正确');
    }
    return ResultData.success(
      await this.authService.login(userLogin),
      '登录成功',
    );
  }

  @AllowAccess()
  @Get('captcha')
  captcha(@Query() getCaptchaParam: GetCaptchaDto) {
    const w = parseInt(getCaptchaParam.w) || 150;
    const h = parseInt(getCaptchaParam.h) || 50;
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 1,
      width: w, // width of captcha
      height: h, // height of captcha
      ignoreChars: '0OoLl1J8BiI9g',
      background: 'rgba(0,0,0,0)',
    });
    const key = AES.encrypt(captcha.text, AppConfig.AesKey);
    return ResultData.success(
      {
        captureEncode: key,
        image: captcha.data,
      },
      '获取成功',
    );
  }

  @Get('logout')
  async logout(@Headers(AppConfig.JWT.header_key) token: string) {
    const auth = await this.authService.logout(token);
    return ResultData.success({}, auth ? '注销成功' : '已注销');
  }
}
