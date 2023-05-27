import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '../../config/app.config';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: AppConfig.JWT.options,
      secret: AppConfig.JWT.secret,
    }),
    MongooseModule.forFeature(
      [{ name: Auth.name, schema: AuthSchema }],
      'Users',
    ),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
