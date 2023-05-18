import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Парсер mif файлов')
    .setDescription('Документация к приложению')
    .setVersion('1.0.0')
    .addTag('Parser')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(process.env.PORT ? process.env.PORT : 3000);
}
bootstrap()
  .then(() =>
    Logger.log(
      `Server started on PORT=${process.env.PORT ? process.env.PORT : 3000}`,
    ),
  )
  .then(() => Logger.log('Swagger Documentation API = /api/swagger'))
  .catch((e) => Logger.log(e));
