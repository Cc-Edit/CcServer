import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AppConfig } from '../config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';

import { JwtAuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(AppConfig.DB.url + '/design?authSource=admin', {
      connectionName: 'Design',
    }),
    MongooseModule.forRoot(AppConfig.DB.url + '/users?authSource=admin', {
      connectionName: 'Users',
    }),
    UserModule,
    AuthModule,
    TaskModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ApplicationModule {}
