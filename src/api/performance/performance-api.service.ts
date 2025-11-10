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

