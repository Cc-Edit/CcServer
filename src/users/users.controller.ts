import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UsePipes, Query
} from "@nestjs/common";
import { UserCreateDto } from './dto/user';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { ValidationPipe } from '../lib/pipe/validate.pipe';
import { getRandomString } from '../lib/utils/common';
import * as md5 from 'crypto-js/md5';
import { v4 as UuidV4 } from 'uuid';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('creat')
  @UsePipes(ValidationPipe)
  async create(@Body() user: UserCreateDto) {
    // 判断用户是否重复
    let findUsers = await this.userService.findBy([{ name: user.name }]);
    if (findUsers.length > 0) {
      return {
        isOk: false,
        message: '用户名已存在',
        data: {},
      };
    }
    findUsers = await this.userService.findBy([{ phone: user.phone }]);
    if (findUsers.length > 0) {
      return {
        isOk: false,
        message: '手机号已注册',
        data: {},
      };
    }
    findUsers = await this.userService.findBy([{ email: user.email }]);
    if (findUsers.length > 0) {
      return {
        isOk: false,
        message: '邮箱已注册',
        data: {},
      };
    }

    user.uuid = UuidV4();
    // 密码加盐
    user.salt = getRandomString();
    user.password = md5(`${user.salt}${user.password}`).toString();
    user.createDate = new Date().getTime();
    user.updateDate = new Date().getTime();
    user.role = 1;
    user.status = 3;
    this.userService.create(user);
    return {
      isOk: true,
      message: '用户创建成功',
      data: {},
    };
  }

  @Post('delete')
  remove(@Body('uuid') uuid: string) {
    return `This action removes a #${uuid} user`;
  }

  @Post('update')
  update(@Body() user: UserCreateDto) {
    return `This action updates a #${user.uuid} user`;
  }

  @Get('findAll')
  async findAll() {
    return {
      isOk: true,
      message: 'success',
      data: await this.userService.findAll(),
    };
  }

  @Post('findByUuid')
  async findByUuid(@Body('uuid') uuid: string) {
    return {
      isOk: true,
      message: 'success',
      data: await this.userService.findBy([
        {
          uuid,
        },
      ]),
    };
  }
}
