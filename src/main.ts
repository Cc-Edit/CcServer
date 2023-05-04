import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false, // 阻止程序异常退出
  });
  await app.listen(8080);
}
bootstrap();
