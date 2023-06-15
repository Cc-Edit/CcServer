import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Logger } from '../../lib/logger/logger.util';
import { User } from '../../user/schemas/user.schema';

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
    comment: '原始文件名',
  })
  name: string;

  @Prop({
    required: true,
    comment: 'oss文件名',
  })
  ossName: string;

  @Prop({
    required: true,
    comment: '文件id',
  })
  uuid: string;

  @Prop({
    required: true,
    comment: '上传用户id',
  })
  createUser: string;

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

schema.post(['updateOne', 'save', 'findOneAndUpdate'], function () {
  Logger.info('updateOne、save、findOneAndUpdate之后，更新数据更新时间字段值');
  const that = this as Oss;
  that.updateDate = new Date().getTime();
});

export const OssSchema = schema;
