import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PerformanceSeederService } from '../performance/performance-seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(PerformanceSeederService);

  try {
    console.log('🚀 공연 상세 정보 수집을 시작합니다...');
    
    const result = await seederService.seedPerformanceDetails();

    console.log('✅ 데이터 수집 완료!', result);
  } catch (error) {
    console.error('❌ 데이터 수집 실패:', error);
    process.exit(1);
  }

  await app.close();
}

bootstrap();

