import {
  IsString,
  IsNotEmpty,
  Equals,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DesignCreate {
  @ApiProperty({ description: 'id', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;

  @ApiProperty({ description: 'layout 结构json', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: 'layout不能为空',
  })
  layout: string;

  @ApiProperty({ description: 'attribute 结构json', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: 'attribute 不能为空',
  })
  attribute: string;

  @ApiProperty({ description: 'event 结构json', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: 'event不能为空',
  })
  event: string;

  @ApiProperty({ description: 'api 结构json', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: 'api不能为空',
  })
  api: string;

  @ApiProperty({ description: 'page 结构json', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: 'page不能为空',
  })
  page: string;
}
