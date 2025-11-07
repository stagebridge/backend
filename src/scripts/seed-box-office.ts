import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PerformanceSeederService } from '../performance/performance-seeder.service';
import { PerformanceDataParser } from '../performance/performance-data-parser.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(PerformanceSeederService);
  const dataParser = app.get(PerformanceDataParser);

  try {
    console.log('🚀 예매상황판 데이터 수집을 시작합니다...');
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await seederService.seedBoxOffice({
      stdate: dataParser.formatDate(yesterday),
      eddate: dataParser.formatDate(today),
    });

    console.log('✅ 데이터 수집 완료!', result);
  } catch (error) {
    console.error('❌ 데이터 수집 실패:', error);
    process.exit(1);
  }

  await app.close();
}

bootstrap();
