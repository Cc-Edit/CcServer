import { IsString, IsNotEmpty, Equals, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../schemas/page.schema';

export class PageCreate {
  @ApiProperty({ description: '类型', required: true })
  @IsNotEmpty({
    message: '类型不能为空',
  })
  @Equals(FileType.Page, {
    message: '类型参数错误',
  })
  type: number;

  @ApiProperty({ description: '标题', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: '标题不能为空',
  })
  @Length(2, 10, {
    message: '标题需要5-20个字符',
  })
  title: string;

  @ApiProperty({ description: '说明', required: false })
  @IsString({ message: '类型错误' })
  @Length(0, 100, {
    message: '说明最长100个字符',
  })
  desc: string;

  @ApiProperty({ description: '上级目录', required: false })
  parent?: string;

  @ApiProperty({ description: '封面地址', required: false })
  cover?: string;

  @ApiProperty({ description: '更新目标uuid', required: false })
  uuid?: string;
}
