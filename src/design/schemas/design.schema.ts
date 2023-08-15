import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Logger } from '../../lib/logger/logger.util';
import { User } from '../../user/schemas/user.schema';

export enum DesignStatus {
  Delete, // 已删除
  Lock, // 锁定编辑
  Open, // 正常可编辑
}

@Schema()
export class Design extends Document {
  @Prop({ required: true, comment: '设计id' })
  id: string;

  @Prop({
    required: true,
    trim: true,
    comment: '结构json',
  })
  layout: string;

  @Prop({
    required: true,
    trim: true,
    comment: '属性json',
  })
  attribute: string;

  @Prop({
    required: true,
    trim: true,
    comment: '事件json',
  })
  event: string;

  @Prop({
    required: true,
    trim: true,
    comment: '接口json',
  })
  api: string;

  @Prop({
    required: true,
    trim: true,
    comment: '页面配置',
  })
  page: string;

  @Prop({ enum: DesignStatus, comment: '设计状态' })
  status?: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createUser: User;

  @Prop({ required: true, comment: '创建时间' })
  createDate: number;

  @Prop({ required: true, comment: '最后更新时间' })
  updateDate: number;
}

const schema = SchemaFactory.createForClass(Design);

schema.pre(['updateOne', 'save', 'findOneAndUpdate'], function (next) {
  Logger.info('updateOne、save之前，补充默认值');
  const that = this as Design;
  that.updateDate = new Date().getTime();
  next();
});
export type DesignDocument = Design & Document;
export const DesignSchema = schema;
