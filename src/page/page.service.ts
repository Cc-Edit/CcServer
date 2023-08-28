import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as md5 from 'crypto-js/md5';
import {
  Page,
  PageDocument,
  PublishStatus,
  PageStatus,
} from './schemas/page.schema';
import { PageCreate } from './dto/page-create';
import { FolderCreate } from './dto/folder-create';
import { v4 as UuidV4 } from 'uuid';
import { UserService } from '../user/user.service';
import { UserFields } from '../lib/constant';
@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name, 'ccServer') private PageModel: Model<PageDocument>,
    private readonly usersService: UserService,
  ) {}

  async create(
    createData: PageCreate | FolderCreate,
    createUserId: string,
    origin = '',
  ): Promise<Page> {
    const createUser = await this.usersService.findByUuid(createUserId);
    const newPage = new this.PageModel({
      ...createData,
      createUser: createUser._id,
      uuid: md5(UuidV4()).toString(),
      createDate: new Date().getTime(),
      updateDate: new Date().getTime(),
      publish: PublishStatus.None,
      status: PageStatus.Open,
      origin,
    });
    return newPage.save();
  }

  async delete(deleteUUid: string) {
    const page = await this.findByUuid(deleteUUid);
    if (page) {
      page.status = PageStatus.Delete;
      await page.save();
      return page;
    }
    return null;
  }

  async findAll(uuid: string): Promise<Page[]> {
    return this.PageModel.find({
      status: {
        $ne: PageStatus.Delete,
      },
      parent: uuid,
    })
      .sort({ createDate: -1 })
      .populate('createUser', UserFields)
      .exec();
  }

  async findByUuid(uuid: string): Promise<Page> {
    return this.PageModel.findOne({
      uuid,
    })
      .populate('createUser', UserFields)
      .exec();
  }

  async find(query: FilterQuery<any>): Promise<Page[]> {
    return this.PageModel.find(query).exec();
  }

  async move(originFileId: string[], targetFolder: string) {
    const originFiles = await this.PageModel.find({
      uuid: {
        $in: originFileId,
      },
    }).exec();
    for (const file of originFiles) {
      file.title = await this.getAvailableTitle(file.title, targetFolder);
      file.parent = targetFolder;
      await file.save();
    }
  }

  async getAvailableTitle(title: string, parent: string, index = 0) {
    const isExist = await this.PageModel.findOne({ title, parent });
    if (isExist) {
      const newTitle = `${title}_副本${index === 0 ? '' : index}`;
      return this.getAvailableTitle(newTitle, parent, ++index);
    } else {
      return title;
    }
  }
}
