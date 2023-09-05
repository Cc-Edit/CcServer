import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { LoggerMiddleware } from './lib/logger/logger.middleware';
import { Logger } from './lib/logger/logger.util';
import { ExceptionsFilter } from './lib/logger/exceptions-filter';
import { HttpExceptionsFilter } from './lib/logger/http-exceptions-filter';
import { TransformInterceptor } from './lib/logger/transform.interceptor';
import { AuthGuard } from './lib/guard/auth.guard';
import { ApplicationModule } from './app.module';
import { AppConfig } from '../config/app.config';
import { mw as requestIpMw } from 'request-ip';
import { ResultData } from './lib/utils/result';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    cors: false,
    abortOnError: false, // 阻止程序异常退出
    logger: ['log', 'error', 'warn', 'debug'],
  });

  // 设置 api 访问前缀
  app.setGlobalPrefix(AppConfig.APP.prefix);

  // web 安全，防常见漏洞
  // 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  // { crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, crossOriginResourcePolicy: false }
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
    }),
  );

  // 全局验证
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true, // 开发环境
      disableErrorMessages: false,
      forbidUnknownValues: false,
    }),
  );

  // 全局 logger
  app.use(LoggerMiddleware);

  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor());
  // 所有异常
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionsFilter());

  // 全局路由守卫
  app.useGlobalGuards(new AuthGuard());

  // 获取真实 ip
  app.use(requestIpMw({ attributeName: 'ip' }));

  // 启用cors
  AppConfig.Cors && app.enableCors();
  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10分钟
      message: async () => {
        return ResultData.fail('请求次数超限');
      },
      statusCode: 200,
      max: 1200, // 限制10分钟内最多只能访问300次
    }),
  );
  const uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10分钟
    message: async () => {
      return ResultData.fail('请求次数超限');
    },
    statusCode: 200,
    max: 50, // 限制10分钟内最多只能访问50次
  });
  app.use('/api/oss/uploadFile', uploadLimiter);
  // swagger 配置
  const options = new DocumentBuilder()
    .setTitle(AppConfig.SWAGGER.title)
    .setDescription(AppConfig.SWAGGER.description)
    .setVersion(AppConfig.SWAGGER.version)
    .addTag(AppConfig.SWAGGER.tag)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(AppConfig.SWAGGER.path, app, document);

  await app.listen(AppConfig.APP.port);
  Logger.info(
    `CcServer 服务启动成功: http://localhost:${AppConfig.APP.port}${AppConfig.APP.prefix}/ `,
    `swagger 文档地址: http://localhost:${AppConfig.APP.port}/${AppConfig.SWAGGER.path}/`,
  );
}
bootstrap();
