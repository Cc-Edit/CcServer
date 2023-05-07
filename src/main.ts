import { NestFactory } from '@nestjs/core';
import { LoggerMiddleware } from './lib/middleware/logger.middleware';
import { AuthGuard } from './lib/guard/auth.guard';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    cors: false,
    abortOnError: false, // 阻止程序异常退出
    logger: ['error', 'warn'],
  });

  app.use(LoggerMiddleware); // 全局 logger
  app.useGlobalGuards(new AuthGuard()); // 全局路由守卫

  await app.listen(8080);
}
bootstrap();
