import { IsString, IsNotEmpty } from 'class-validator';
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
  layout?: string;

  @ApiProperty({ description: 'attribute 结构json', required: true })
  @IsString({ message: '类型错误' })
  attribute?: string;

  @ApiProperty({ description: 'event 结构json', required: true })
  @IsString({ message: '类型错误' })
  event?: string;

  @ApiProperty({ description: 'api 结构json', required: true })
  @IsString({ message: '类型错误' })
  api?: string;

  @ApiProperty({ description: 'page 结构json', required: true })
  @IsString({ message: '类型错误' })
  page?: string;

  @ApiProperty({ description: 'lines 结构json', required: true })
  @IsString({ message: '类型错误' })
  lines?: string;
}
