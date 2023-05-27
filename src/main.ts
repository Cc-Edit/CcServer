import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { LoggerMiddleware } from './lib/middleware/logger.middleware';
import { AuthGuard } from './lib/guard/auth.guard';
import { ApplicationModule } from './app.module';
import { AppConfig } from '../config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    cors: false,
    abortOnError: false, // 阻止程序异常退出
    logger: ['log', 'error', 'warn', 'debug'],
  });

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  )

  // 设置 api 访问前缀
  app.setGlobalPrefix(AppConfig.Base.APP.prefix);

  // web 安全，防常见漏洞
  // 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  // { crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, crossOriginResourcePolicy: false }
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
    }),
  );

  app.use(LoggerMiddleware); // 全局 logger
  app.useGlobalGuards(new AuthGuard()); // 全局路由守卫

  await app.listen(AppConfig.Base.APP.port);
}
bootstrap();
