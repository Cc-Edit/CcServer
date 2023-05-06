import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://root:123456@127.0.0.1:27017/design', {
      connectionName: 'design',
    }),
    MongooseModule.forRoot('mongodb://root:123456@127.0.0.1:27017/users', {
      connectionName: 'users',
    }),
  ],
  providers: [AuthService],
})
export class ApplicationModule {}
