import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
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

  async create(createData: PageCreate | FolderCreate): Promise<Page> {
    const newPage = new this.PageModel({
      ...createData,
      createUser: '',
      uuid: UuidV4(),
      createDate: new Date().getTime(),
      publish: PublishStatus.None,
      status: PageStatus.Open,
    });
    return newPage.save();
  }
}
