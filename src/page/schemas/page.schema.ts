import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PageDocument = Page & Document;

export enum PageStatus {
  Delete, // 已删除
  Lock, // 锁定编辑
  Open, // 正常可编辑
}

export enum PublishStatus {
  Published, // 已发布
  HasUpdate, // 有更新
  Offline, // 下线
}

export enum FileType {
  Page, // 页面
  Folder, // 文件夹
}

@Schema()
export class Page extends Document {
  @Prop({ required: true, enum: PageStatus, comment: '名称' })
  type: string;

  @Prop({
    required: true,
    trim: true,
    comment: '名称',
  })
  title: string;

  @Prop({ required: true, comment: '父级文件夹' })
  parent?: string;

  @Prop({ comment: '封面' })
  cover?: string;

  @Prop({ required: true, comment: '创建者uuid' })
  createUser: string;

  @Prop({ required: true, comment: '创建时间' })
  createDate: number;

  @Prop({ required: true, comment: '最后更新时间' })
  updateDate: number;

  // 页面独有属性
  @Prop({ enum: PublishStatus, comment: '发布状态' })
  publish?: boolean;

  @Prop({ enum: PageStatus, comment: '页面状态' })
  status?: number;
}

const schema = SchemaFactory.createForClass(Page);

export const PageSchema = schema;
