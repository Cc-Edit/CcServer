import {
  Controller,
  Post,
  Headers,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser } from './dto/login-user.dto';
import { AllowAnon } from '../common/decorators/allow-anon.decorator';
import { AppConfig } from '../../config/app.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnon()
  @Post('login')
  async login(@Body() userLogin: LoginUser) {
    return {
      isOk: true,
      message: '登录成功',
      data: await this.authService.login(userLogin),
    };
  }

  @Get('logout')
  async logout(@Headers(AppConfig.Base.JWT.HEADER_KEY) token: string) {
    const auth = await this.authService.logout(token);
    return {
      isOk: true,
      message: auth ? '注销成功' : '已注销',
      data: {},
    };
  }
}
