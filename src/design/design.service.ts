import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Design, DesignStatus, DesignDocument } from './schemas/design.schema';
import { DesignCreate } from './dto/design-create';
import { UserService } from '../user/user.service';
import { UserFields } from '../lib/constant';
@Injectable()
export class DesignService {
  constructor(
    @InjectModel(Design.name, 'ccServer')
    private DesignModel: Model<DesignDocument>,
    private readonly usersService: UserService,
  ) {}
  /**
   * 设计保存
   * */
  async save(designData: DesignCreate, createUserId: string) {
    const createUser = await this.usersService.findByUuid(createUserId);
    const newDesign = new this.DesignModel({
      ...designData,
      createUser: createUser._id,
      createDate: new Date().getTime(),
      updateDate: new Date().getTime(),
      status: DesignStatus.Open,
    });
    return newDesign.save();
  }
  /**
   * 设计删除
   * */
  async delete(deleteId: string) {
    const design = await this.findById(deleteId);
    if (design) {
      design.status = DesignStatus.Delete;
      await design.save();
      return design;
    }
    return null;
  }
  /**
   * 设计查找
   * */
  findById(id: string) {
    return this.DesignModel.findOne({
      id,
    })
      .populate('createUser', UserFields)
      .exec();
  }

  async find(query: FilterQuery<any>): Promise<Design[]> {
    return this.DesignModel.find(query).exec();
  }
}
