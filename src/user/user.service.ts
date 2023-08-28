import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery, Condition } from 'mongoose';
import { UserCreate } from './dto/user-create';
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import { v4 as UuidV4 } from 'uuid';
import * as md5 from 'crypto-js/md5';
import { getRandomString } from '../lib/utils/common';
import { UserFields } from '../lib/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection('ccServer') private connection: Connection, // mongo 连接对象
    @InjectModel(User.name, 'ccServer') private UserModel: Model<UserDocument>,
  ) {}

  async create(createUser: UserCreate): Promise<User> {
    const salt = getRandomString();
    const password = md5(`${salt}${createUser.password}`).toString();
    const newUser = new this.UserModel({
      ...createUser,
      uuid: UuidV4(),
      salt,
      password,
      createDate: new Date().getTime(),
      updateDate: new Date().getTime(),
    });
    return newUser.save();
  }

  async delete(uuid: string) {
    const user = await this.findByUuid(uuid);
    if (user) {
      user.status = UserStatus.Delete;
      await user.save();
      return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find(
      {
        status: UserStatus.Open,
      },
      UserFields,
    )
      .sort({ createDate: -1 })
      .exec();
  }

  async findByUuid(uuid: string): Promise<User> {
    return this.UserModel.findOne(
      {
        uuid,
      },
      UserFields,
    );
  }

  async findBy(queryArr: Condition<any>): Promise<User[]> {
    return this.UserModel.find({ $or: queryArr }).exec();
  }

  async find(query: FilterQuery<any>): Promise<User[]> {
    return this.UserModel.find(query).exec();
  }
}
