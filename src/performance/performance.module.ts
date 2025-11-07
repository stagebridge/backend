import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { PerformanceDetail } from './entities/performance-detail.entity';
import { PerformanceService } from './performance.service';
import { PerformanceSeederService } from './performance-seeder.service';
import { PerformanceDataParser } from './performance-data-parser.service';
import { KopisModule } from '../external/kopis/kopis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Performance,
      PerformanceDetail,
    ]),
    KopisModule,
  ],
  providers: [PerformanceService, PerformanceSeederService, PerformanceDataParser],
  exports: [PerformanceService, PerformanceSeederService],
})
export class PerformanceModule {}

