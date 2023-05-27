import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class LoginUser {
  @ApiProperty({ description: '用户名', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({ message: '账号不能为空' })
  readonly username: string;

  @ApiProperty({ description: '密码', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
