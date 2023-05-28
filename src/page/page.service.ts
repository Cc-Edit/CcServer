import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument } from './schemas/page.schema';
import { PageCreate } from './dto/page-create';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name, 'Users') private PageModel: Model<PageDocument>,
  ) {}

  async createPage(createPage: PageCreate): Promise<Page> {
    const newPage = new this.PageModel(createPage);
    return newPage.save();
  }
}
