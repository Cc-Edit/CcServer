import { ApiProperty } from '@nestjs/swagger';
export class ResultData {
  constructor(code = 200, isOk = true, msg?: string, data?: any) {
    this.code = code;
    this.isOk = isOk;
    this.msg = msg || 'ok';
    this.data = data || null;
  }

  @ApiProperty({ type: 'number', default: 200 })
  code: number;

  @ApiProperty({ type: 'boolean', default: true })
  isOk: boolean;

  @ApiProperty({ type: 'string', default: 'ok' })
  msg?: string;

  data?: any;

  static success(data?: any, msg?: string) {
    return new ResultData(200, true, msg || 'success', data);
  }

  static fail(msg?: string, code?: number, data?: any): ResultData {
    return new ResultData(code || 200, false, msg || 'fail', data);
  }
}
