import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OssController } from './oss.controller';
import { OssService } from './oss.service';
import { Oss, OssSchema } from './schemas/oss.schema';

@Module({
  controllers: [OssController],
  providers: [OssService],
  exports: [OssService],
  imports: [
    MongooseModule.forFeature(
      [{ name: Oss.name, schema: OssSchema }],
      'ccServer',
    ),
  ], // 导入模块
})
export class OssModule {}
