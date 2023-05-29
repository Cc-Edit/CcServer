import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreate {
  @ApiProperty({ description: '用户账号', required: true })
  @IsString({ message: '用户名类型错误' })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @Length(5, 20, {
    message: '用户名需要5-20个字符',
  })
  @Matches(/^[a-zA-Z0-9_]/, {
    message: '用户名只能包含字母、数字、下划线',
  })
  name: string;

  @ApiProperty({ description: '手机号', required: true })
  @IsString({ message: '手机号类型错误' })
  @IsNotEmpty({
    message: '手机号不能为空',
  })
  @Matches(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/, {
    message: '手机号码不正确',
  })
  phone: string;

  @ApiProperty({ description: '邮箱', required: true })
  @IsString({ message: '邮箱类型错误' })
  @Matches(
    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    {
      message: '邮箱地址格式不正确',
    },
  )
  email: string;

  @ApiProperty({ description: '密码', required: true })
  @IsString({ message: '密码类型错误' })
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,}$/,
    {
      message: '密码中必须包含字母、数字和特殊字符, 长度大于6位',
    },
  )
  password: string;

  @ApiProperty({ description: '头像', required: false })
  avatar?: string;

  @ApiProperty({ description: '角色', required: false })
  role?: number;

  @ApiProperty({ description: '用户状态', required: false })
  status?: number;

  @ApiProperty({ description: '更新uuid', required: false })
  uuid?: string;
}
