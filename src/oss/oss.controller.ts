import {
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  UploadedFiles,
  Request, Body,
  StreamableFile
} from "@nestjs/common";
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { OssService } from './oss.service';
import { FindOss } from './dto/find-oss';
import { ResultData } from '../lib/utils/result';
import { AppConfig } from "../../config/app.config";
import { createReadStream } from 'fs';

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

  @Get('download')
  async getFile(@Body('uuid') uuid: string) {
    const file = await this.ossService.getFile(uuid);
    if (!file) {
      return ResultData.fail('文件不存在');
    }
    const path = `${AppConfig.OSS.RootPath}${file.location}`;
    const fileStream = createReadStream(path);
    return new StreamableFile(fileStream);
  }
}
