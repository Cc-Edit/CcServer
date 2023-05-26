import {
  Controller,
  UseGuards,
  Post,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser } from './dto/login-user.dto';
import { AllowAnon } from '../common/decorators/allow-anon.decorator';

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
  async logout(@Request() req) {
    return {
      isOk: true,
      message: '注销成功',
      data: {},
    };
  }
}
