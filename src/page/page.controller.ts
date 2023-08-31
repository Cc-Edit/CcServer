import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { PageService } from './page.service';
import { PageCreate } from './dto/page-create';
import { FolderCreate } from './dto/folder-create';
import { PageStatus, FileType, RootId } from './schemas/page.schema';
import { ResultData } from '../lib/utils/result';
import { UserService } from '../user/user.service';

@Controller('page')
export class PageController {
  constructor(
    private pageService: PageService,
    private userService: UserService,
  ) {}

  @Post('creatPage')
  async creatPage(@Body() page: PageCreate, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    const findPages = await this.pageService.find({
      $and: [
        {
          type: FileType.Page,
        },
        {
          createUser: currentUser._id,
        },
        {
          status: {
            $ne: PageStatus.Delete,
          },
        },
        {
          parent: page.parent || RootId,
        },
      ],
    });
    // 判断是否重复
    const repeatTitle = findPages.find((item) => {
      return item.title === page.title;
    });
    if (!currentUser) {
      return ResultData.fail('登录token已失效');
    }
    if (findPages.length >= 40) {
      return ResultData.fail('一个目录下最多创建40个页面');
    }
    if (repeatTitle) {
      return ResultData.fail('页面已存在');
    }
    await this.pageService.create(page, currentUser);
    return ResultData.success({}, '页面创建成功');
  }

  @Post('creatFolder')
  async creatFolder(@Body() folder: FolderCreate, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    const findFolders = await this.pageService.find({
      $and: [
        {
          type: FileType.Folder,
        },
        {
          createUser: currentUser._id,
        },
        {
          status: {
            $ne: PageStatus.Delete,
          },
        },
        {
          parent: folder.parent || RootId,
        },
      ],
    });
    // 判断是否重复
    const repeatTitle = findFolders.find((item) => {
      return item.title === folder.title;
    });
    if (!currentUser) {
      return ResultData.fail('登录token已失效');
    }
    if (repeatTitle) {
      return ResultData.fail('文件夹已存在');
    }
    if (findFolders.length >= 20) {
      return ResultData.fail('最多创建20个应用');
    }
    await this.pageService.create(folder, currentUser);
    return ResultData.success({}, '文件夹创建成功');
  }

  @Post('update')
  async update(@Body() page: PageCreate | FolderCreate, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    const { uuid, title, cover, parent, desc } = page;
    if (!uuid) {
      return ResultData.fail('参数uuid不能为空');
    }
    const current = await this.pageService.findByUuid(uuid);
    if (!current) {
      return ResultData.fail('目标不存在');
    }
    if (current.createUser.uuid !== currentUuid) {
      return ResultData.fail('只能编辑自己创建的应用或页面');
    }
    // 判断是否重复
    const findPage = await this.pageService.find({
      $and: [
        {
          type: current.type,
        },
        {
          createUser: currentUser._id,
        },
        {
          uuid: {
            $ne: current.uuid,
          },
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
          parent: current.parent || RootId,
        },
      ],
    });
    if (findPage.length > 0) {
      return ResultData.fail('页面已存在');
    }
    Object.assign(current, {
      title,
      desc,
      cover,
      parent,
    });
    await current.save();
    return ResultData.success({}, '更新成功');
  }

  @Get('delete')
  async delete(@Query('uuid') uuid: string, @Request() req) {
    const { uuid: currentUserId } = req.user || {};
    const currentPage = await this.pageService.findByUuid(uuid);
    if (currentPage.createUser.uuid !== currentUserId) {
      return ResultData.fail('只有创建者有权限删除~');
    }
    const deletePage = await this.pageService.delete(uuid);
    return ResultData.success(
      {},
      deletePage ? '删除成功' : '页面/文件夹不存在',
    );
  }

  @Get('getFolder')
  async getFolder(@Query('uuid') uuid: string, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    return ResultData.success(
      await this.pageService.findAll(uuid || 'root', currentUser),
    );
  }

  @Get('move')
  async move(@Query('origin') origin: string, @Query('target') target: string) {
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

  @Get('copy')
  async copy(@Query('uuid') uuid: string, @Request() req) {
    const { uuid: currentUuid } = req.user || {};
    const currentUser = await this.userService.findByUuid(currentUuid);
    const current = await this.pageService.findByUuid(uuid);
    let newTitle = `${current.title}_副本`;
    let count = 0;
    const limitPage = await this.pageService.find({
      $and: [
        {
          type: current.type,
        },
        {
          createUser: currentUser._id,
        },
        {
          parent: current.parent || RootId,
        },
        {
          status: {
            $ne: PageStatus.Delete,
          },
        },
      ],
    });
    if (current.type === FileType.Folder && limitPage.length >= 20) {
      return ResultData.fail('最多创建20个应用');
    }
    if (current.type === FileType.Page && limitPage.length >= 40) {
      return ResultData.fail('一个目录下最多创建40个页面');
    }
    // 判断是否重复
    const findPage = await this.pageService.find({
      $or: [
        {
          $and: [
            {
              title: {
                $regex: new RegExp(newTitle),
              },
            },
            {
              createUser: currentUser._id,
            },
            {
              status: {
                $ne: PageStatus.Delete,
              },
            },
          ],
        },
        {
          $and: [
            {
              type: current.type,
            },
            {
              createUser: currentUser._id,
            },
            {
              status: {
                $ne: PageStatus.Delete,
              },
            },
            {
              origin: {
                $eq: current.uuid,
              },
            },
            {
              parent: current.parent || RootId,
            },
          ],
        },
      ],
    });
    while (
      findPage.find(
        (element) => element.title === `${newTitle}${count === 0 ? '' : count}`,
      )
    ) {
      ++count;
    }
    newTitle = `${newTitle}${count === 0 ? '' : count}`;
    await this.pageService.create(
      {
        title: newTitle,
        type: current.type,
        desc: current.desc,
        parent: current.parent,
        cover: current.cover,
      },
      currentUser,
      current.uuid,
    );
    return ResultData.success({}, '复制成功');
  }

  @Get('getPage')
  async getPage(@Query('uuid') uuid: string, @Request() req) {
    return ResultData.success(await this.pageService.findByUuid(uuid));
  }
}
