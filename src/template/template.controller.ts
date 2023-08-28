import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateCreate } from './dto/template-create';
import { ResultData } from '../lib/utils/result';
import { TemplateStatus, TemplateType } from './schemas/template.schema';
import { DesignService } from '../design/design.service';
import { PageService } from '../page/page.service';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/schemas/user.schema';
import { DesignStatus } from '../design/schemas/design.schema';
import { FileType, PageStatus, RootId } from '../page/schemas/page.schema';
import { dateFormat } from '../common/util/common';

@Controller('template')
export class TemplateController {
  constructor(
    private templateService: TemplateService,
    private designService: DesignService,
    private pageService: PageService,
    private userService: UserService,
  ) {}

  @Post('saveTemplate')
  async saveTemplate(@Body() template: TemplateCreate, @Request() req) {
    const { type, name, cover, templateStr, originId } = template;
    const { uuid: currentUserId } = req.user || {};
    if (!currentUserId) {
      return ResultData.fail('登录token已失效');
    }
    const createUser = await this.userService.findByUuid(currentUserId);
    // 只有admin权限可以保存
    if (createUser.role !== UserRole.Admin) {
      return ResultData.fail('只有管理员有权限添加模板~');
    }
    // 页面模板，在后台获取模板json
    if (type === TemplateType.Page) {
      if (!originId) {
        return ResultData.fail('originId 参数不能为空');
      }
      const originDesign = await this.designService.findById(originId);
      if (!originDesign) {
        return ResultData.fail('页面还未进行编辑，模板内容不允许为空');
      }
      const pageTemplateStr = JSON.stringify({
        layout: originDesign.layout,
        attribute: originDesign.attribute,
        lines: originDesign.lines,
        event: originDesign.event,
        api: originDesign.api,
        page: originDesign.page,
      });
      await this.templateService.save(
        {
          type,
          name,
          cover,
          originId,
          templateStr: pageTemplateStr,
        },
        currentUserId,
      );
    } else if (type === TemplateType.Component) {
      if (!templateStr) {
        return ResultData.fail('组件模板内容不允许为空');
      }
      await this.templateService.save(
        {
          type,
          name,
          cover,
          originId,
          templateStr,
        },
        currentUserId,
      );
    } else {
      return ResultData.fail('参数type类型不存在');
    }
    return ResultData.success({}, '保存模板成功');
  }

  @Get('delete')
  async delete(@Query('uuid') uuid: string, @Request() req) {
    const { uuid: currentUserId } = req.user || {};
    if (!currentUserId) {
      return ResultData.fail('登录token已失效');
    }
    const createUser = await this.userService.findByUuid(currentUserId);
    // 只有admin权限可以删除
    if (createUser.role !== UserRole.Admin) {
      return ResultData.fail('只有管理员有权限删除模板~');
    }

    const template = await this.templateService.findByUuid(uuid);
    if (!template) {
      return ResultData.fail('模板不存在~');
    }
    template.status = TemplateStatus.Delete;
    await template.save();
    return ResultData.success({}, '模板删除成功');
  }

  @Get('list')
  async list(@Query('type') type?: string) {
    const templateList = await this.templateService.find({
      $and: [
        {
          type: type ? type : TemplateType.Page,
        },
        {
          status: {
            $ne: DesignStatus.Delete,
          },
        },
      ],
    });
    return ResultData.success(templateList);
  }

  @Get('getTemplate')
  async getTemplate(@Query('uuid') uuid: string, @Request() req) {
    return ResultData.success(await this.templateService.findByUuid(uuid));
  }

  @Get('createTemplatePage')
  async createTemplatePage(@Query('uuid') uuid: string, @Request() req) {
    const { uuid: currentUser } = req.user || {};
    const templateIns = await this.templateService.findByUuid(uuid);
    const { name, cover, templateStr } = templateIns;
    if (templateIns.type !== TemplateType.Page) {
      return ResultData.fail('请使用页面模板创建新页面');
    }
    if (!currentUser) {
      return ResultData.fail('登录token已失效');
    }
    const newPageData = {
      type: FileType.Page,
      title: `${name}-模板-${dateFormat(new Date().getTime(), 'Y-M-D(h:m:s)')}`,
      parent: RootId,
      cover,
    };
    const findPages = await this.pageService.find({
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
          parent: RootId,
        },
      ],
    });
    if (findPages.length >= 40) {
      return ResultData.fail('根目录下最多创建40个页面');
    }
    const newPage = await this.pageService.create(newPageData, currentUser);
    try {
      const templateJson = JSON.parse(templateStr);
      const { layout, attribute, lines, event, api, page } = templateJson;
      const newDesign = {
        id: newPage.uuid,
        layout,
        attribute,
        lines,
        event,
        api,
        page,
      };
      await this.designService.save(newDesign, currentUser);
      return ResultData.success({ uuid: newPage.uuid }, '创建成功');
    } catch (e) {
      return ResultData.fail('模板解析失败');
    }
  }
}
