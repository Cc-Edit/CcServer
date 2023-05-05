import { NestFactory } from '@nestjs/core';
import { LoggerMiddleware } from './lib/middleware/logger.middleware';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    abortOnError: false, // 阻止程序异常退出
  });
  app.use(LoggerMiddleware); // 全局 logger
  await app.listen(8080);
}
bootstrap();
