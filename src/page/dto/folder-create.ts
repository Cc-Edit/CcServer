import { IsString, IsNotEmpty, Equals, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../schemas/page.schema';

export class FolderCreate {
  @ApiProperty({ description: '类型', required: true })
  @IsNotEmpty({
    message: '类型不能为空',
  })
  @Equals(FileType.Folder, {
    message: '类型参数错误',
  })
  type: number;

  @ApiProperty({ description: '标题', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: '标题不能为空',
  })
  @Length(2, 10, {
    message: '标题需要2-10个字符',
  })
  title: string;

  @ApiProperty({ description: '上级目录', required: false })
  @IsString({ message: '类型错误' })
  parent?: string;

  @ApiProperty({ description: '封面地址', required: false })
  @IsString({ message: '类型错误' })
  cover?: string;

  @ApiProperty({ description: '更新目标uuid', required: false })
  @IsString({ message: '类型错误' })
  uuid?: string;
}
