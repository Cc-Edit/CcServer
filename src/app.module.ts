import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AppConfig } from '../config/app.config';

@Module({
  imports: [
    MongooseModule.forRoot(AppConfig.Base.DB.URI + '/design?authSource=admin', {
      connectionName: 'Design',
    }),
    MongooseModule.forRoot(AppConfig.Base.DB.URI + '/users?authSource=admin', {
      connectionName: 'Users',
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthModule,
    },
  ],
})
export class ApplicationModule {}
