import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { DesignService } from './design.service';
import { DesignCreate } from './dto/design-create';
import { ResultData } from '../lib/utils/result';
import { DesignStatus } from './schemas/design.schema';
import { PageService } from '../page/page.service';

@Controller('design')
export class DesignController {
  constructor(
    private designService: DesignService,
    private pageService: PageService,
  ) {}

  @Post('saveDesign')
  async saveDesign(@Body() design: DesignCreate, @Request() req) {
    const { uuid: currentUser } = req.user || {};
    const { id, page } = design;
    const designList = await this.designService.find({
      $and: [
        {
          id,
        },
        {
          status: {
            $ne: DesignStatus.Delete,
          },
        },
      ],
    });
    // 不存在直接创建，存在则更新字段
    if (designList.length === 0) {
      await this.designService.save(design, currentUser);
    } else {
      const designItem = designList.shift();
      Object.assign(designItem, design);
      await designItem.save();
    }
    // 内部修改标题时同步修改page数据
    try {
      const pageData = JSON.parse(page);
      const { title, cover } = pageData;
      const pageIns = await this.pageService.findByUuid(id);
      if (pageIns) {
        Object.assign(pageIns, {
          title,
          cover,
        });
        await pageIns.save();
      }
    } catch (e) {}
    return ResultData.success({}, '保存成功');
  }

  @Get('delete')
  async delete(@Query('id') id: string, @Request() req) {
    const { uuid: currentUserId } = req.user || {};
    const currentDesign = await this.designService.findById(id);
    if (currentDesign.createUser.uuid !== currentUserId) {
      return ResultData.fail('只有创建者有权限删除~');
    }
    const deleteDesign = await this.designService.delete(id);
    return ResultData.success({}, deleteDesign ? '删除成功' : '设计不存在');
  }

  @Get('getDesign')
  async getDesign(@Query('id') id: string, @Request() req) {
    return ResultData.success(await this.designService.findById(id));
  }
}
