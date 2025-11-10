import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
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

  async findRankedPerformances() {
    const performances = await this.performanceRepository.find({
      where: {
        rnum: Not(IsNull()),
      },
      select: ['mt20id', 'prfnm', 'prfpdfrom', 'prfpdto', 'poster', 'prfcast'],
      order: {
        rnum: 'ASC',
      },
    });

    return performances;
  }

  async findPerformancesByGenre(genre: string) {
    const performances = await this.performanceRepository.find({
      where: {
        genrenm: genre,
      },
      select: ['mt20id', 'prfnm', 'prfpdfrom', 'prfpdto', 'poster', 'prfcast'],
      order: {
        rnum: 'ASC',
      },
    });

    return performances;
  }
}

