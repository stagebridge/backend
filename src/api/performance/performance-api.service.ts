import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from '../../performance/entities/performance.entity';

@Injectable()
export class PerformanceApiService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
  ) {}

  async findAllSummaries() {
    const performances = await this.performanceRepository.find({
      select: ['mt20id', 'prfnm', 'prfpdfrom', 'prfpdto', 'prfcast', 'poster'],
    });

    return performances;
  }

  async findRankedByGenre(genre: string) {
    const performances = await this.performanceRepository.find({
      where: {
        genrenm: genre,
      },
      select: ['prfnm', 'prfpdfrom', 'prfpdto', 'poster', 'prfcast'],
      order: {
        rnum: 'ASC', // 순위가 낮을수록(1이 가장 높은 순위) 높은 순위
      },
    });

    return performances;
  }

  async findMainPerformances(genre: string) {
    // 순위별: 모든 장르를 순위순으로 정렬
    const ranked = await this.performanceRepository.find({
      select: ['prfnm', 'prfpdfrom', 'prfpdto', 'poster', 'prfcast'],
      order: {
        rnum: 'ASC',
      },
    });

    // 장르별: 특정 장르를 순위순으로 정렬
    const byGenre = await this.performanceRepository.find({
      where: {
        genrenm: genre,
      },
      select: ['prfnm', 'prfpdfrom', 'prfpdto', 'poster', 'prfcast'],
      order: {
        rnum: 'ASC',
      },
    });

    return {
      ranked,
      byGenre,
    };
  }
}

