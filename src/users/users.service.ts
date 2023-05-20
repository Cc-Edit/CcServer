import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { UserCreateDto } from './dto/user';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('Users') private connection: Connection, // mongo 连接对象
    @InjectModel(User.name, 'Users') private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: UserCreateDto): Promise<User> {
    const createdCat = new this.userModel(createUserDto);
    return createdCat.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findBy(
    queryArr: {
      name?: string;
      phone?: string;
      email?: string;
    }[],
  ): Promise<User[]> {
    return this.userModel.find({ $or: queryArr }).exec();
  }
}
