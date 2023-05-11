import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
export enum UserStatus {
  Delete,
  Disable,
  Expired,
  Open,
}
export enum UserRole {
  Admin,
  User,
}
@Schema()
export class User extends Document {
  @Prop({
    required: true,
    trim: true,
  })
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

  @Prop({ required: true, enum: UserRole })
  role: number; // 用户角色

  @Prop({ required: true, enum: UserStatus })
  status: number; // 用户状态
}

const schema = SchemaFactory.createForClass(User);
schema.pre(['updateOne', 'save'], (next) => {
  console.log('find方法  执行之前，这里代码会执行');
  next();
});

schema.post(['updateOne', 'save'], (next) => {
  console.log('find方法  执行之后，这里代码会执行');
  next();
});

export const UserSchema = schema;
