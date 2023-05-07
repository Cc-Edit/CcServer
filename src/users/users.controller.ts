import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UsePipes,
} from '@nestjs/common';
import { UserDto } from './dto/user';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { ValidationPipe } from './pipe/validate.pipe';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
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
    // throw new NotFoundException(); // 抛出异常
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} user`;
  }
}
