import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';
import { PerformanceDetail } from './entities/performance-detail.entity';

@Injectable()
export class PerformanceService {
  private readonly logger = new Logger(PerformanceService.name);

  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(PerformanceDetail)
    private readonly performanceDetailRepository: Repository<PerformanceDetail>,
  ) {}

  async deleteCompletedPerformances() {
    this.logger.log('공연완료 데이터 삭제 시작...');

    try {
      const completedDetails = await this.performanceDetailRepository.find({
        where: { prfstate: '공연완료' },
      });

      if (completedDetails.length === 0) {
        this.logger.log('삭제할 공연완료 데이터가 없습니다.');
        return { success: true, deletedCount: 0 };
      }

      const deletedCount = completedDetails.length;
      const mt20ids = completedDetails.map((detail) => detail.mt20id);

      await this.performanceDetailRepository.delete(mt20ids);
      await this.performanceRepository.delete(mt20ids);

      this.logger.log(`공연완료 데이터 삭제 완료! 총 ${deletedCount}개 삭제됨`);
      return { success: true, deletedCount };
    } catch (error) {
      this.logger.error('공연완료 데이터 삭제 실패', error);
      throw error;
    }
  }
}
