import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformDataInterceptor } from './utils/transformData.interceptor';
import { UserResponseDto } from './users/dto/response-user.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // transform: true,
    }),
  );
  // app.useGlobalInterceptors(new TransformDataInterceptor(UserResponseDto));

  const config = new DocumentBuilder()
    .setTitle('LIK-booking')
    .setDescription('A booking system for LIK')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
}
bootstrap();
