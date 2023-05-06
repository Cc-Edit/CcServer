import { IsString, IsInt } from 'class-validator';

export class UserDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly age: number;

  @IsInt()
  readonly phone: number;

  @IsString()
  readonly password: string;
}
