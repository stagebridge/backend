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
}

