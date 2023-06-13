import {
  Controller,
  Post,
  Headers,
  Get,
  Body,
  Session,
  Response,
  HttpStatus, Param, Query
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { LoginUser } from './dto/login-user.dto';
import { AllowAccess } from '../common/decorators/allow-access.decorator';
import { AppConfig } from '../../config/app.config';
import { ResultData } from '../lib/utils/result';
import * as svgCaptcha from 'svg-captcha';
import { GetCaptureDto } from "./dto/get-capture.dto";
import { Logger } from '../lib/logger/logger.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAccess()
  @Post('login')
  async login(@Body() userLogin: LoginUser, @Session() session) {
    if (session.captcha.toLowerCase() !== userLogin.captcha.toLowerCase()) {
      return ResultData.fail('验证码不正确');
    }
    return ResultData.success(
      await this.authService.login(userLogin),
      '登录成功',
    );
  }

  @AllowAccess()
  @Get('captcha')
  captcha(@Query() getCaptureParam: GetCaptureDto, @Response() res, @Session() session) {
    const w = parseInt(getCaptureParam.w) || 150;
    const h = parseInt(getCaptureParam.h) || 50;
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 1,
      width: w, // width of captcha
      height: h, // height of captcha
      ignoreChars: '0OoLl1J8BiI9g',
      background: 'rgba(0,0,0,0)',
    });
    session.captcha = captcha.text;
    res.type('svg');
    res.status(HttpStatus.OK).send(captcha.data);
  }

  @Get('logout')
  async logout(@Headers(AppConfig.JWT.header_key) token: string) {
    const auth = await this.authService.logout(token);
    return ResultData.success({}, auth ? '注销成功' : '已注销');
  }
}
