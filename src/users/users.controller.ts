import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UsePipes,
} from '@nestjs/common';
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} user`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UserCreateDto) {
    return `This action updates a #${id} user`;
  }

  @Get()
  async findAll(): Promise<User[]> {
    // throw new NotFoundException(); // 抛出异常
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} user`;
  }
}
