import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceApiController } from './performance-api.controller';
import { PerformanceApiService } from './performance-api.service';
import { Performance } from '../../performance/entities/performance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Performance])],
  controllers: [PerformanceApiController],
  providers: [PerformanceApiService],
})
export class PerformanceApiModule {}
