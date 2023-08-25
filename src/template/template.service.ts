import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as md5 from 'crypto-js/md5';
import { v4 as UuidV4 } from 'uuid';
import {
  Template,
  TemplateStatus,
  TemplateDocument,
} from './schemas/template.schema';
import { TemplateCreate } from './dto/template-create';
import { UserService } from '../user/user.service';
import { UserFields } from '../lib/constant';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name, 'ccServer')
    private TemplateModel: Model<TemplateDocument>,
    private readonly userService: UserService,
  ) {}
  /**
   * 模板保存
   * */
  async save(templateData: TemplateCreate, createUserId: string) {
    const createUser = await this.userService.findByUuid(createUserId);
    const newTemplate = new this.TemplateModel({
      ...templateData,
      uuid: md5(UuidV4()).toString(),
      createUser: createUser._id,
      createDate: new Date().getTime(),
      updateDate: new Date().getTime(),
      status: TemplateStatus.Open,
      count: 0,
    });
    return newTemplate.save();
  }
  /**
   * 模板查找
   * */
  findByUuid(uuid: string) {
    return this.TemplateModel.findOne({
      uuid,
    })
      .populate('createUser', UserFields)
      .exec();
  }

  async find(query: FilterQuery<any>): Promise<Template[]> {
    return this.TemplateModel.find(query)
      .populate('createUser', UserFields)
      .exec();
  }
}
