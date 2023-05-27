import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class TaskService {
  constructor(
    private readonly authService: AuthService
  ) {}

  private readonly logger = new Logger(TaskService.name);

  // 每天结束后清空一下 token 黑名单
  @Cron('59 59 23 * * *')
  async handleCron() {
    await this.authService.cleanExpireToken();
    this.logger.debug('Called when the second is 15');
  }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }
  //
  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }
}