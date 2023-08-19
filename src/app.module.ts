import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { DesignModule } from './design/design.module';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './page/page.module';
import { OssModule } from './oss/oss.module';
import { APP_GUARD } from '@nestjs/core';
import { AppConfig } from '../config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'oss'),
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(AppConfig.DB.url + '/ccServer?authSource=admin', {
      connectionName: 'ccServer',
    }),
    UserModule,
    AuthModule,
    TaskModule,
    PageModule,
    OssModule,
    DesignModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [],
})
export class ApplicationModule {}
