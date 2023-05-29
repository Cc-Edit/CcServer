import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { PageService } from './page.service';
import { PageCreate } from './dto/page-create';
import { FolderCreate } from './dto/folder-create';
import { PageStatus, FileType, RootId } from './schemas/page.schema';
import { ResultData } from '../lib/utils/result';

@Controller('page')
export class PageController {
  constructor(private pageService: PageService) {}

  @Post('creatPage')
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
      return ResultData.fail('登录消息已失效');
    }
    if (findPage.length > 0) {
      return ResultData.fail('页面已存在');
    }
    await this.pageService.create(page, currentUser);
    return ResultData.success({}, '页面创建成功');
  }

  @Post('creatFolder')
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
      return ResultData.fail('登录消息已失效');
    }
    if (findFolder.length > 0) {
      return ResultData.fail('文件夹已存在');
    }
    await this.pageService.create(folder, currentUser);
    return ResultData.success({}, '文件夹创建成功');
  }

  @Post('update')
  async update(@Body() page: PageCreate | FolderCreate) {
    const { uuid, title, cover, parent } = page;
    if (!uuid) {
      return ResultData.fail('参数uuid不能为空');
    }
    const current = await this.pageService.findByUuid(uuid);
    if (!current) {
      return ResultData.fail('目标不存在');
    }
    Object.assign(current, {
      title,
      cover,
      parent,
    });
    await current.save();
    return ResultData.success({}, '更新成功');
  }

  @Post('delete')
  async remove(@Body('uuid') uuid: string) {
    const deleteUser = await this.pageService.delete(uuid);
    return ResultData.success(
      {},
      deleteUser ? '删除成功' : '页面/文件夹不存在',
    );
  }

  @Get('getFolder')
  async getFolder(@Body('uuid') uuid: string) {
    return ResultData.success(await this.pageService.findAll(uuid));
  }

  @Post('move')
  async move(@Body('origin') origin: string, @Body('target') target: string) {
    if (target) {
      const current = await this.pageService.findByUuid(target);
      if (current.type !== FileType.Folder) {
        return ResultData.fail('目标必须是文件夹');
      }
    } else {
      target = RootId;
    }
    const originFile = origin.split(',');
    if (originFile.length === 0) {
      return ResultData.fail('没有要移动的文件');
    }
    await this.pageService.move(originFile, target);
    return ResultData.success({}, '操作完成');
  }

  @Post('getPage')
  async getPage(@Body('uuid') uuid: string) {
    return ResultData.success(await this.pageService.findByUuid(uuid));
  }
}
