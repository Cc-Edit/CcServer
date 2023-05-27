import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'crypto-js/md5';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection('Users') private connection: Connection, // mongo 连接对象
    @InjectModel(Auth.name, 'Users') private AuthModel: Model<AuthDocument>,
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
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logout(token: string) {
    const isDisabled = await this.AuthModel.exists({
      token,
    });
    if (isDisabled) {
      return null;
    }
    const tokenDate = this.jwtService.decode(token);
    const disabledToken = new this.AuthModel({
      token,
      cancelDate: new Date().getTime(),
      iat: tokenDate['iat'] * 1000,
      exp: tokenDate['exp'] * 1000,
    });
    return disabledToken.save();
  }

  /**
   * token 校验
   * */
  async verify(token: string) {
    const isDisabled = await this.AuthModel.exists({
      token,
    });
    if (isDisabled) {
      return null;
    }
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      return null;
    }
  }
}
