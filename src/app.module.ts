import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DesignModule } from './design/design.module';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './page/page.module';
import { APP_GUARD } from '@nestjs/core';
import { AppConfig } from '../config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';

import { JwtAuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(AppConfig.DB.url + '/ccServer?authSource=admin', {
      connectionName: 'ccServer',
    }),
    UserModule,
    AuthModule,
    TaskModule,
    PageModule,
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
