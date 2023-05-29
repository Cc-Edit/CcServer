import {
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { OssService } from './oss.service';
import { FindOss } from './dto/find-oss';
import { ResultData } from '../lib/utils/result';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post('upload')
  @ApiOperation({ summary: '文件上传,返回 url 地址' })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ): Promise<ResultData> {
    const { uuid: currentUser } = req.user || {};
    return await this.ossService.create(files, currentUser);
  }

  @Get('list')
  @ApiOperation({ summary: '查询文件上传列表' })
  async findList(@Query() search: FindOss): Promise<ResultData> {
    return await this.ossService.findList(search);
  }
}
