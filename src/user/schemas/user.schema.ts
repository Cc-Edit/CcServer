import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Logger } from '../../lib/logger/logger.util';

export type UserDocument = User & Document;
export enum UserStatus {
  Delete,
  Disable,
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
    comment: '用户名',
  })
  name: string;

  @Prop({ required: true, comment: '手机号' })
  phone: string;

  @Prop({ comment: '邮箱' })
  email: string;

  @Prop({ comment: '头像' })
  avatar: string;

  @Prop({ required: true, comment: '密码' })
  password: string;

  @Prop({ required: true, comment: '盐' })
  salt: string;

  @Prop({ required: true, comment: '用户id' })
  uuid: string;

  @Prop({ required: true, comment: '创建时间' })
  createDate: number;

  @Prop({ required: true, comment: '最后更新时间' })
  updateDate: number;

  @Prop({
    required: true,
    enum: UserRole,
    default: UserRole.User,
    comment: '用户角色',
  })
  role: number;

  @Prop({
    required: true,
    enum: UserStatus,
    default: UserStatus.Open,
    comment: '用户状态',
  })
  status: number;
}

const schema = SchemaFactory.createForClass(User);

schema.pre(['updateOne', 'save', 'findOneAndUpdate'], function (next) {
  Logger.info('updateOne、save之前，补充默认值');
  const that = this as User;
  if (that.avatar) that.avatar = '';
  that.updateDate = new Date().getTime();
  next();
});

export const UserSchema = schema;
