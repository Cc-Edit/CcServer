import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUser {
  @ApiProperty({ description: '用户名', required: true })
  @IsString({ message: '类型错误' })
  @Length(5, 20, {
    message: '用户名格式不正确',
  })
  @Matches(/^[a-zA-Z0-9_]/, {
    message: '用户名格式不正确',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @ApiProperty({ description: '密码', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiProperty({ description: '图形验证码', required: true })
  @IsString({ message: '类型错误' })
  @Matches(/^[a-zA-Z0-9]{4, 6}$/, {
    message: '图形验证码格式不正确',
  })
  @IsNotEmpty({ message: '图形验证码不能为空' })
  readonly captcha: string;
}
