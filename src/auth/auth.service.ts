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
    @InjectConnection('ccServer') private connection: Connection, // mongo 连接对象
    @InjectModel(Auth.name, 'ccServer') private AuthModel: Model<AuthDocument>,
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
    const { password, salt } = user;
    if (password === md5(`${salt}${pass}`).toString()) {
      return { uuid: user.uuid };
    } else {
      return null;
    }
  }

  async login(user: any) {
    const payload = await this.validateUser(user.username, user.password);
    if (!payload) {
      throw new UnauthorizedException('验证失败，用户名密码不匹配');
    }
    return {
      access_token: this.jwtService.sign(payload),
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
  // 清空黑名单中过期的token
  async cleanExpireToken() {
    const now = new Date().getTime();
    await this.AuthModel.deleteMany({
      $or: [
        {
          exp: {
            $lte: now,
          },
        },
        {
          exp: null,
        },
      ],
    });
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
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (e) {
      return null;
    }
  }
}
