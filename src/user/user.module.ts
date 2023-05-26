import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 共享模块
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'Users',
    ),
  ], // 导入模块
})
export class UserModule {}
