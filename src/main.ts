import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    abortOnError: false, // 阻止程序异常退出
  });
  await app.listen(8080);
}
bootstrap();
