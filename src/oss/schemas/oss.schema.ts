import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OssDocument = Oss & Document;

export enum OssStatus {
  Delete,
  Default,
  Lock,
}

@Schema()
export class Oss extends Document {
  @Prop({
    required: true,
    comment: '文件名',
  })
  name: string;

  @Prop({
    required: true,
    comment: '文件id',
  })
  uuid: string;

  @Prop({
    required: true,
    comment: '上传用户id',
  })
  userId: string;

  @Prop({
    required: true,
    comment: '文件大小',
  })
  size: number;

  @Prop({
    required: true,
    comment: '文件类型',
  })
  type: string;

  @Prop({ required: true, comment: '存储路径' })
  location: string;

  @Prop({ required: true, comment: '创建时间' })
  createDate: number;

  @Prop({ required: true, comment: '最后更新时间' })
  updateDate: number;

  @Prop({
    required: true,
    enum: OssStatus,
    default: OssStatus.Default,
    comment: '文件状态',
  })
  status: number;
}

const schema = SchemaFactory.createForClass(Oss);

export const OssSchema = schema;
