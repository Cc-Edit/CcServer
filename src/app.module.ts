import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { getDir } from './lib/utils/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      encoding: 'utf-8',
      isGlobal: true,
      expandVariables: true,
      envFilePath: [...getDir('./config', { filter: { format: '.env' } })],
    }),
    MongooseModule.forRoot(
      process.env.DATABASE_URI + '/design?authSource=admin',
      {
        connectionName: 'design',
      },
    ),
    MongooseModule.forRoot(
      process.env.DATABASE_URI + '/users?authSource=admin',
      {
        connectionName: 'users',
      },
    ),
    // UsersModule,
    AuthModule,
  ],
  providers: [AuthService],
})
export class ApplicationModule {}
