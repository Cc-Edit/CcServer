import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Oss, OssDocument } from './schemas/oss.schema';
import { ResultData } from '../lib/utils/result';
import { v4 as UuidV4 } from 'uuid';
import * as fs from 'fs';
import mime from 'mime-types';
import { AppConfig } from '../../config/app.config';
import { FindOss } from './dto/find-oss';

@Injectable()
export class OssService {
  constructor(
    @InjectConnection('ccServer') private connection: Connection, // mongo 连接对象
    @InjectModel(Oss.name, 'ccServer') private OssModel: Model<OssDocument>,
  ) {}

  async create(files: Array<Express.Multer.File>, userId: string) {
    const result = [];
    files.map(async (file) => {
      const uuid = UuidV4();
      // 重新命名文件， uuid, 根据 mimeType 决定 文件扩展名， 直接拿后缀名不可靠
      const newFileName = `${uuid.replace(/-/g, '')}.${mime.extension(
        file.mimetype,
      )}`;
      // const newFileName = `${uuid.v4().replace(/-/g, '')}.${file.originalname.split('.').pop().toLowerCase()}`
      // 文件存储路径
      const fileLocation = `${AppConfig.OSS.RootPath}/${newFileName}`;
      // fs 创建文件写入流
      const writeFile = fs.createWriteStream(fileLocation);
      // 写入文件
      writeFile.write(file.buffer);
      // 千万别忘记了 关闭流
      writeFile.close();
      const ossFile = new this.OssModel({
        ossName: newFileName,
        name: file.filename,
        uuid,
        userId,
        size: file.size,
        type: file.mimetype,
        location: `/${newFileName}`,
        createDate: new Date().getTime(),
      });
      result.push(ossFile.uuid);
      await ossFile.save();
    });
    return ResultData.success(result, '上传完成');
  }

  async findList(search: FindOss): Promise<ResultData> {
    const { startDay, endDay } = search;
    const fileList = this.OssModel.find({
      createDate: {
        $lte: endDay,
        $gte: startDay,
      },
    }).exec();
    return ResultData.success(fileList);
  }

  async getFile(uuid: string): Promise<Oss> {
    return this.OssModel.findOne({
      uuid,
    });
  }
}