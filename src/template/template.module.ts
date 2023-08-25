import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schemas/template.schema';
import { UserModule } from '../user/user.module';
import { DesignModule } from '../design/design.module';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService], // 共享模块
  imports: [
    MongooseModule.forFeature(
      [{ name: Template.name, schema: TemplateSchema }],
      'ccServer',
    ),
    UserModule,
    DesignModule,
  ],
})
export class TemplateModule {}
