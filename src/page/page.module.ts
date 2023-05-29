import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PageSchema } from './schemas/page.schema';

@Module({
  controllers: [PageController],
  providers: [PageService],
  exports: [PageService], // 共享模块
  imports: [
    MongooseModule.forFeature(
      [{ name: Page.name, schema: PageSchema }],
      'ccServer',
    ),
  ], // 导入模块
})
export class PageModule {}
