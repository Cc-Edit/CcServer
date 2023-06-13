import { ApiProperty } from '@nestjs/swagger';

export class GetCaptchaDto {
  @ApiProperty({ description: '图片宽度', required: false })
  readonly w?: string;

  @ApiProperty({ description: '图片高度', required: false })
  readonly h?: string;
}
