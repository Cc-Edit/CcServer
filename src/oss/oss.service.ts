import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Oss, OssDocument } from './schemas/oss.schema';

@Injectable()
export class OssService {
  constructor(
    @InjectConnection('ccServer') private connection: Connection, // mongo 连接对象
    @InjectModel(Oss.name, 'ccServer') private OssModel: Model<OssDocument>,
  ) {}
}
