import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'crypto-js/md5';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
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
    const payload = { username: user.username, uuid: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
