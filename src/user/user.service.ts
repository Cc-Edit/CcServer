import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery, Condition } from 'mongoose';
import { UserCreate } from './dto/user-create';
import { User, UserDocument, UserStatus } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection('Users') private connection: Connection, // mongo 连接对象
    @InjectModel(User.name, 'Users') private UserModel: Model<UserDocument>,
  ) {}

  async create(createUser: UserCreate): Promise<User> {
    const createdCat = new this.UserModel(createUser);
    return createdCat.save();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find({
      status: UserStatus.Open,
    }).exec();
  }

  async findByUuid(uuid: string): Promise<User[]> {
    return this.UserModel.find({
      $or: [
        {
          uuid,
        },
      ],
    }).exec();
  }

  async findBy(queryArr: Condition<any>): Promise<User[]> {
    return this.UserModel.find({ $or: queryArr }).exec();
  }

  async find(query: FilterQuery<any>): Promise<User[]> {
    return this.UserModel.find(query).exec();
  }
}
