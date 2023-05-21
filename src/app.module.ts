import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { getDir } from './lib/utils/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

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
        connectionName: 'Design',
      },
    ),
    MongooseModule.forRoot(
      process.env.DATABASE_URI + '/users?authSource=admin',
      {
        connectionName: 'Users',
      },
    ),
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
