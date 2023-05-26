import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AppConfig } from '../config/app.config';

import { JwtAuthGuard } from './common/guards/auth.guard'

@Module({
  imports: [
    MongooseModule.forRoot(AppConfig.Base.DB.URI + '/design?authSource=admin', {
      connectionName: 'Design',
    }),
    MongooseModule.forRoot(AppConfig.Base.DB.URI + '/users?authSource=admin', {
      connectionName: 'Users',
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ApplicationModule {}
