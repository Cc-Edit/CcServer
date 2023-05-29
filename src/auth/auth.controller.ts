import { Controller, Post, Headers, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser } from './dto/login-user.dto';
import { AllowAccess } from '../common/decorators/allow-access.decorator';
import { AppConfig } from '../../config/app.config';
import { ResultData } from '../lib/utils/result';

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

  @Get('logout')
  async logout(@Headers(AppConfig.JWT.header_key) token: string) {
    const auth = await this.authService.logout(token);
    return ResultData.success({}, auth ? '注销成功' : '已注销');
  }
}
