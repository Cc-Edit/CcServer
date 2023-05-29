import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OssService } from './oss.service';
import { FindOss } from './dto/find-oss';
import { ResultData } from '../lib/utils/result';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post('upload')
  @ApiOperation({ summary: '文件上传,返回 url 地址' })
  async uploadFile(): Promise<ResultData> {
    return ResultData.success({}, '成功');
  }

  @Get('list')
  @ApiOperation({ summary: '查询文件上传列表' })
  async findList(@Query() search: FindOss): Promise<ResultData> {
    return ResultData.success({ search }, '成功');
  }
}
