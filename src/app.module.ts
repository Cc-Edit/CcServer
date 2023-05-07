import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URI + '/design', {
      connectionName: 'design',
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI + '/users', {
      connectionName: 'users',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.base.env',
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [AuthService],
})
export class ApplicationModule {}
