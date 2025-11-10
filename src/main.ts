import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('StageBridge API')
    .setDescription('StageBridge 공연 정보 API 문서')
    .setVersion('1.0')
    .addTag('performances', '공연 관련 API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
