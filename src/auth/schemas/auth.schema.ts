import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

export enum TokenStatus {
  Enabled,
  Disable
}

@Schema()
export class Auth extends Document {
  @Prop({
    required: true,
    comment: 'token',
  })
  token: string;

  @Prop({ required: true, enum: TokenStatus, default:TokenStatus.Disable, comment: 'token状态' })
  status: number;

  @Prop({ required: true, comment: '注销时间' })
  cancelDate: number;

  @Prop({ required: true, comment: 'token创建时间' })
  iat: number;

  @Prop({ required: true, comment: 'token过期时间' })
  exp: number;
}

const schema = SchemaFactory.createForClass(Auth);

export const AuthSchema = schema;
