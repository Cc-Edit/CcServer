import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsNumber,
} from 'class-validator';
import { UserStatus } from '../schemas/user.schema';

export class UserDto {
  @IsString()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @Length(5, 20, {
    message: '用户名需要5-20个字符',
  })
  @Matches(/^[a-zA-Z0-9_]/, {
    message: '用户名只能包含字母、数字、下划线',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty({
    message: '手机号不能为空',
  })
  @Matches(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$/, {
    message: '手机号码不正确',
  })
  readonly phone: string;

  @IsString()
  @Matches(
    /^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$/,
    {
      message: '邮箱地址格式不正确',
    },
  )
  readonly email: string;

  @IsString()
  readonly avatar: string;

  @IsString()
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,}$/,
    {
      message: '密码中必须包含字母、数字和特殊字符, 长度大于6位',
    },
  )
  readonly password: string;

  @IsString()
  readonly salt: string;

  @IsString()
  readonly uuid: string;

  @IsNumber()
  readonly createDate: string;

  @IsNumber()
  readonly updateDate: string;

  @IsNumber()
  readonly role: string;
  //
  // readonly status: typeof UserStatus;
}
