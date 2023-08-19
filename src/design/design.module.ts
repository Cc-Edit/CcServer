import { Module } from '@nestjs/common';
import { DesignController } from './design.controller';
import { DesignService } from './design.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Design, DesignSchema } from './schemas/design.schema';
import { UserModule } from '../user/user.module';
import { PageModule } from '../page/page.module';

@Module({
  controllers: [DesignController],
  providers: [DesignService],
  exports: [DesignService], // 共享模块
  imports: [
    MongooseModule.forFeature(
      [{ name: Design.name, schema: DesignSchema }],
      'ccServer',
    ),
    UserModule,
    PageModule,
  ],
})
export class DesignModule {}
