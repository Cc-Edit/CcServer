import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Design, DesignSchema, DesignDocument } from './schemas/design.schema';
import { DesignCreate } from './dto/design-create';
import { UserService } from '../user/user.service';
@Injectable()
export class DesignService {
  constructor(
    @InjectModel(Design.name, 'ccServer')
    private DesignModel: Model<DesignDocument>,
    private readonly usersService: UserService,
  ) {}
}
