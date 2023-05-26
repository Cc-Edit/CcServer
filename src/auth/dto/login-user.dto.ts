import { IsString, IsNotEmpty } from 'class-validator'

export class LoginUser {
  @IsString({ message: '类型错误' })
  @IsNotEmpty({ message: '账号不能为空' })
  readonly username: string

  @IsString({ message: '类型错误' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string
}
