import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { UserCreate } from './dto/user-create';
import { UserService } from './user.service';
import { UserStatus } from './schemas/user.schema';
import { ValidationPipe } from '../lib/pipe/validate.pipe';
import { getRandomString } from '../lib/utils/common';
import * as md5 from 'crypto-js/md5';
import { v4 as UuidV4 } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('creat')
  @UsePipes(ValidationPipe)
  async create(@Body() user: UserCreate) {
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
    await this.userService.create(user);
    return {
      isOk: true,
      message: '用户创建成功',
      data: {},
    };
  }

  @Post('delete')
  async remove(@Body('uuid') uuid: string) {
    const oldUser = await this.userService.findByUuid(uuid);
    if (oldUser) {
      oldUser.status = UserStatus.Delete
      await oldUser.save();
    }
    return {
      isOk: true,
      message: '删除成功',
      data: {},
    };
  }

  @Post('update')
  @UsePipes(ValidationPipe)
  async update(@Body() user: UserCreate) {
    const { uuid, name, phone, email, password } = user;
    if (!uuid) {
      return {
        isOk: false,
        message: '用户uuid不能为空',
        data: {},
      };
    }
    const oldUser = await this.userService.findByUuid(uuid);
    if (!oldUser) {
      return {
        isOk: false,
        message: '用户不存在',
        data: {},
      };
    }
    let newUser = await this.userService.find({
      $and: [
        {
          name,
        },
        {
          uuid: { $not: { $eq: oldUser.uuid } },
        },
      ],
    });
    if (newUser.length > 0) {
      return {
        isOk: false,
        message: '用户名已存在',
        data: {},
      };
    }
    newUser = await this.userService.find({
      $and: [
        {
          phone,
        },
        {
          uuid: { $not: { $eq: oldUser.uuid } },
        },
      ],
    });
    if (newUser.length > 0) {
      return {
        isOk: false,
        message: '手机号已注册',
        data: {},
      };
    }
    newUser = await this.userService.find({
      $and: [
        {
          email,
        },
        {
          uuid: { $not: { $eq: oldUser.uuid } },
        },
      ],
    });
    if (newUser.length > 0) {
      return {
        isOk: false,
        message: '邮箱已注册',
        data: {},
      };
    }
    if (password) {
      user.password = md5(`${oldUser.salt}${password}`).toString();
    }
    Object.assign(oldUser, user);
    await oldUser.save();
    return {
      isOk: true,
      message: '更新成功',
      data: {},
    };
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
      data: await this.userService.findByUuid(uuid),
    };
  }
}
