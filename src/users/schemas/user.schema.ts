import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
export enum UserStatus {
  Delete,
  Disable,
  Expired,
  Open,
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string; // 用户名

  @Prop({ required: true })
  phone: string; // 手机号

  @Prop()
  email: string; // 邮箱

  @Prop()
  avatar: string; // 头像

  @Prop({ required: true })
  password: string; // 密码

  @Prop({ required: true })
  salt: string; // 盐

  @Prop({ required: true })
  uuid: string; // 用户id

  @Prop({ required: true })
  createDate: number; // 创建时间

  @Prop({ required: true })
  updateDate: number; // 最后更新时间

  @Prop({ required: true })
  role: number; // 角色

  @Prop({ required: true })
  status: typeof UserStatus; // 用户状态
}

export const UserSchema = SchemaFactory.createForClass(User);
