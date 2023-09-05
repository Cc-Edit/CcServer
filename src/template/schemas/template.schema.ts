import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Logger } from '../../lib/logger/logger.util';
import { User } from '../../user/schemas/user.schema';

export enum TemplateStatus {
  Delete, // 已删除
  Open, // 正常可编辑
}
export enum TemplateType {
  Page, // 页面模板
  Component, // 组件模板
}

@Schema()
export class Template extends Document {
  @Prop({ required: true, comment: '模板id' })
  uuid: string;

  @Prop({ required: false, comment: '原始id' })
  originId?: string;

  @Prop({ required: true, comment: '名称' })
  name: string;

  @Prop({ required: false, comment: '封面地址' })
  cover?: string;

  @Prop({ enum: TemplateType, comment: '模板类型' })
  type: number;

  @Prop({
    trim: true,
    comment: '模板json',
  })
  templateStr: string;

  @Prop({ comment: '使用计数' })
  count?: number;

  @Prop({ enum: TemplateStatus, comment: '模板状态' })
  status?: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createUser: User;

  @Prop({ required: true, comment: '创建时间' })
  createDate: number;

  @Prop({ required: true, comment: '最后更新时间' })
  updateDate: number;
}

const schema = SchemaFactory.createForClass(Template);

schema.pre(['updateOne', 'save', 'findOneAndUpdate'], function (next) {
  const that = this as Template;
  that.updateDate = new Date().getTime();
  next();
});
export type TemplateDocument = Template & Document;
export const TemplateSchema = schema;
