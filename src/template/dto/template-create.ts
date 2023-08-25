import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TemplateCreate {
  @ApiProperty({ description: 'originId', required: false })
  originId?: string;

  @ApiProperty({ description: 'cover', required: false })
  cover?: string;

  @ApiProperty({ description: 'string', required: true })
  @IsString({ message: '类型错误' })
  @IsNotEmpty({
    message: '模板名称不能为空',
  })
  name: string;

  @ApiProperty({ description: 'type', required: true })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 0,
    },
    { message: '类型错误' },
  )
  @IsNotEmpty({
    message: '模板类型不能为空',
  })
  type: number;

  @ApiProperty({ description: '模板json', required: false })
  templateStr?: string;
}
