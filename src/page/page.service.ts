import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Condition, FilterQuery, Model } from 'mongoose';
import {
  Page,
  PageDocument,
  PublishStatus,
  PageStatus,
} from './schemas/page.schema';
import { PageCreate } from './dto/page-create';
import { FolderCreate } from './dto/folder-create';
import { v4 as UuidV4 } from 'uuid';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name, 'Users') private PageModel: Model<PageDocument>,
  ) {}

  async create(
    createData: PageCreate | FolderCreate,
    createUser: string,
  ): Promise<Page> {
    const newPage = new this.PageModel({
      ...createData,
      createUser,
      uuid: UuidV4(),
      createDate: new Date().getTime(),
      publish: PublishStatus.None,
      status: PageStatus.Open,
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
    }).exec();
  }

  async findByUuid(uuid: string): Promise<Page> {
    return this.PageModel.findOne({
      uuid,
    });
  }

  async find(query: FilterQuery<any>): Promise<Page[]> {
    return this.PageModel.find(query).exec();
  }
}
