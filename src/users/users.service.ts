import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from "mongoose";
import { UserCreateDto } from './dto/user';
import { User, UserDocument, UserStatus } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('Users') private connection: Connection, // mongo 连接对象
    @InjectModel(User.name, 'Users') private UserModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: UserCreateDto): Promise<User> {
    const createdCat = new this.UserModel(createUserDto);
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

  async findBy(
    queryArr: {
      name?: string;
      phone?: string;
      email?: string;
      uuid?: string;
    }[],
  ): Promise<User[]> {
    return this.UserModel.find({ $or: queryArr }).exec();
  }

  async find(query: FilterQuery<any>): Promise<User[]> {
    return this.UserModel.find(query).exec();
  }
}
