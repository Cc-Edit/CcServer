import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TaskService],
})
export class TaskModule {}
