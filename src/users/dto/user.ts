import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  Matches,
} from 'class-validator';

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

  @IsInt()
  readonly age: number;

  @IsInt()
  readonly phone: number;

  @IsString()
  readonly password: string;
}
