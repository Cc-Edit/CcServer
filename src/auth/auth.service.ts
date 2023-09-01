import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'crypto-js/md5';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ResultData } from '../lib/utils/result';
import { UserStatus } from '../user/schemas/user.schema';

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
    const { password, salt, status } = user;
    const isDisable = status !== 2;
    if (isDisable) {
      return { error: '用户已被禁用或删除' };
    } else if (password === md5(`${salt}${pass}`).toString()) {
      return { uuid: user.uuid };
    } else {
      return { error: '验证失败，用户名密码不匹配' };
    }
  }

  async login(user: any) {
    const payload = await this.validateUser(user.username, user.password);
    const { error } = payload;
    if (error) {
      return ResultData.fail(error);
    }
    return ResultData.success(
      {
        access_token: this.jwtService.sign(payload),
      },
      '登录成功',
    );
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
    const tokenDate = this.jwtService.decode(token);
    const isDisabled = await this.AuthModel.exists({
      token,
    });
    if (isDisabled) {
      return null;
    }
    const { uuid } = tokenDate as Record<string, any>;
    const user = await this.usersService.findByUuid(uuid);
    if (user.status !== UserStatus.Open) {
      await this.logout(token);
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
