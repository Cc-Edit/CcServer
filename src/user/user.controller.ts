import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { UserDto } from './dto/user';
import { UserService } from './user.service';
import { User } from './interfaces/user';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() user: UserDto) {
    this.userService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} user`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UserDto) {
    return `This action updates a #${id} user`;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} user`;
  }
}
