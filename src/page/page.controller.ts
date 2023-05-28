import { Body, Controller, Get, Post, UsePipes, Request } from '@nestjs/common';
import { PageService } from './page.service';
import { ValidationPipe } from '../lib/pipe/validate.pipe';
import { PageCreate } from './dto/page-create';
import { FolderCreate } from './dto/folder-create';
import { PageStatus, FileType, RootId } from './schemas/page.schema';

@Controller('page')
export class PageController {
  constructor(private pageService: PageService) {}

  @Post('creatPage')
  @UsePipes(ValidationPipe)
  async create(@Body() page: PageCreate, @Request() req) {
    const { uuid: currentUser } = req.user || {};
    // 判断用户是否重复
    const findPage = await this.pageService.find({
      $and: [
        {
          type: FileType.Page,
        },
        {
          status: {
            $ne: PageStatus.Delete,
          },
        },
        {
          title: page.title,
        },
        {
          parent: page.parent || RootId,
        },
      ],
    });
    if (!currentUser) {
      return {
        isOk: false,
        message: '登录消息已失效',
        data: {},
      };
    }
    if (findPage.length > 0) {
      return {
        isOk: false,
        message: '页面已存在',
        data: {},
      };
    }
    await this.pageService.create(page, currentUser);
    return {
      isOk: true,
      message: '页面创建成功',
      data: {},
    };
  }

  @Post('creatFolder')
  @UsePipes(ValidationPipe)
  async createFolder(@Body() folder: FolderCreate, @Request() req) {
    const { uuid: currentUser } = req.user || {};
    // 判断用户是否重复
    const findFolder = await this.pageService.find({
      $and: [
        {
          type: FileType.Folder,
        },
        {
          status: {
            $ne: PageStatus.Delete,
          },
        },
        {
          title: folder.title,
        },
        {
          parent: folder.parent || RootId,
        },
      ],
    });
    if (!currentUser) {
      return {
        isOk: false,
        message: '登录消息已失效',
        data: {},
      };
    }
    if (findFolder.length > 0) {
      return {
        isOk: false,
        message: '文件夹已存在',
        data: {},
      };
    }
    await this.pageService.create(folder, currentUser);
    return {
      isOk: true,
      message: '文件夹创建成功',
      data: {},
    };
  }

  @Post('update')
  @UsePipes(ValidationPipe)
  async update(@Body() page: (PageCreate | FolderCreate) & { uuid: string }) {
    const { uuid, title, cover, parent } = page;
    if (!uuid) {
      return {
        isOk: false,
        message: '参数uuid不能为空',
        data: {},
      };
    }
    const current = await this.pageService.findByUuid(uuid);
    if (!current) {
      return {
        isOk: false,
        message: '目标不存在',
        data: {},
      };
    }
    Object.assign(current, {
      title,
      cover,
      parent,
    });
    await current.save();
    return {
      isOk: true,
      message: '更新成功',
      data: {},
    };
  }

  @Post('delete')
  async remove(@Body('uuid') uuid: string) {
    const deleteUser = await this.pageService.delete(uuid);
    return {
      isOk: true,
      message: deleteUser ? '删除成功' : '页面/文件夹不存在',
      data: {},
    };
  }

  @Get('getFolder')
  async getFolder(@Body('uuid') uuid: string) {
    return {
      isOk: true,
      message: 'success',
      data: await this.pageService.findAll(uuid),
    };
  }

  @Post('getPage')
  async getPage(@Body('uuid') uuid: string) {
    return {
      isOk: true,
      message: 'success',
      data: await this.pageService.findByUuid(uuid),
    };
  }
}
