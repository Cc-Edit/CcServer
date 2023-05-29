import { ApiProperty } from '@nestjs/swagger';

export class FindOss {
  @ApiProperty({ description: '搜索条件，起始时间', required: false })
  startDay?: number;

  @ApiProperty({ description: '搜索条件，结束时间', required: false })
  endDay?: number;
}
