import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'crypto-js/md5';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userName: string, pass: string): Promise<any> {
    const users = await this.usersService.findBy([
      {
        name: userName,
      },
    ]);
    if (users.length === 0) return null;
    const user = users.shift();
    const { password, salt, ...result } = user;
    if (password === md5(`${salt}${pass}`).toString()) {
      return result;
    } else {
      return null;
    }
  }

  async login(user: any) {
    const loginUser = await this.validateUser(user.username, user.password);
    if (!loginUser) {
      throw new UnauthorizedException('验证失败，用户名密码不匹配');
    }
    const payload = { username: loginUser.username, uuid: loginUser.uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * token 校验
   * */
  async verify(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }
}
