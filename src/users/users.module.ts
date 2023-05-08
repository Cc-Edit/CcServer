import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 共享模块
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema,  }],
      'Users',
    ),
  ], // 导入模块
})
export class UsersModule {}
