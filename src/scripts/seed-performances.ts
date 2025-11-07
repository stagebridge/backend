import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PerformanceService } from '../performance/performance.service';
import { PerformanceSeederService } from '../performance/performance-seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const performanceService = app.get(PerformanceService);
  const seederService = app.get(PerformanceSeederService);

  try {
    console.log('🚀 공연 데이터 수집을 시작합니다...');
    
    // 공연완료 데이터 삭제
    await performanceService.deleteCompletedPerformances();
    
    // 공연 데이터 수집
    const result = await seederService.seedPerformanceData({
      stdate: '20241107',
      eddate: '20251107',
      rows: 100,
    });

    console.log('✅ 데이터 수집 완료!', result);
  } catch (error) {
    console.error('❌ 데이터 수집 실패:', error);
    process.exit(1);
  }

  await app.close();
}

bootstrap();

