import { Controller, Post, Body, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserCreate, UserQuery, UserUpdate } from './dto/user-create';
import { UserService } from './user.service';
import * as md5 from 'crypto-js/md5';
import { ResultData } from '../lib/utils/result';
import { UserRole, UserStatus } from './schemas/user.schema';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('creat')
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() user: UserCreate, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    if (currentUser.role !== UserRole.Admin) {
      return ResultData.fail('只有管理员有权限创建用户');
    } else {
      user.createUser = currentUuid;
    }
    // 判断用户是否重复
    const findUsers = await this.userService.findBy([{ name: user.name }]);
    if (findUsers.length > 0) {
      return ResultData.fail('用户名已存在');
    }
    // findUsers = await this.userService.findBy([{ phone: user.phone }]);
    // if (findUsers.length > 0) {
    //   return ResultData.fail('手机号已注册');
    // }
    // findUsers = await this.userService.findBy([{ email: user.email }]);
    // if (findUsers.length > 0) {
    //   return ResultData.fail('邮箱已注册');
    // }
    await this.userService.create(user);
    return ResultData.success({}, '用户创建成功');
  }

  @Post('delete')
  async remove(@Body('uuid') uuid: string, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    if (currentUser.role !== UserRole.Admin) {
      return ResultData.fail('只有管理员有权限删除用户');
    }
    const deleteUser = await this.userService.delete(uuid);
    return ResultData.success({}, deleteUser ? '删除成功' : '用户不存在');
  }

  @Post('update')
  async update(@Body() user: UserUpdate, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    if (currentUser.role !== UserRole.Admin) {
      return ResultData.fail('只有管理员有权限更新用户');
    }
    const { uuid, name, password } = user;
    if (!uuid) {
      return ResultData.fail('用户uuid不能为空');
    }
    const oldUser = await this.userService.findByUuid(uuid);
    if (!oldUser) {
      return ResultData.fail('用户不存在');
    }
    const newUser = await this.userService.find({
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
      return ResultData.fail('用户名已存在');
    }
    // newUser = await this.userService.find({
    //   $and: [
    //     {
    //       phone,
    //     },
    //     {
    //       uuid: { $not: { $eq: oldUser.uuid } },
    //     },
    //   ],
    // });
    // if (newUser.length > 0) {
    //   return ResultData.fail('手机号已注册');
    // }
    // newUser = await this.userService.find({
    //   $and: [
    //     {
    //       email,
    //     },
    //     {
    //       uuid: { $not: { $eq: oldUser.uuid } },
    //     },
    //   ],
    // });
    // if (newUser.length > 0) {
    //   return ResultData.fail('邮箱已注册');
    // }
    if (password) {
      if (
        !new RegExp(
          /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,30}$/,
        ).test(password)
      ) {
        return ResultData.fail(
          '密码中必须包含字母、数字和特殊字符, 长度大于6位小于30位',
        );
      }
      user.password = md5(`${oldUser.salt}${password}`).toString();
    }
    Object.assign(oldUser, user);
    await oldUser.save();
    return ResultData.success({}, '更新成功');
  }

  @Post('list')
  async list(@Body() query: UserQuery) {
    return ResultData.success({
      list: await this.userService.findAll(query),
      count: await this.userService.count({}),
    });
  }

  @Post('findByUuid')
  async findByUuid(@Body('uuid') uuid: string, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    return ResultData.success(
      await this.userService.findByUuid(uuid || currentUuid),
    );
  }

  @Post('updateUserStatus')
  async updateUserStatus(
    @Body('uuid') uuid: string,
    @Body('status') status: number,
    @Request() req,
  ) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    if (currentUser.role !== UserRole.Admin) {
      return ResultData.fail('只有管理员有权限更新用户状态');
    }
    const oldUser = await this.userService.findByUuid(uuid);
    if (!oldUser) {
      return ResultData.fail('用户不存在');
    }
    if (!Object.values(UserStatus).includes(status)) {
      return ResultData.fail('未知的用户状态');
    }
    oldUser.status = status;
    await oldUser.save();
    return ResultData.success('状态更新成功');
  }
}
