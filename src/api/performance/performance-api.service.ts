import { Injectable, NotFoundException } from '@nestjs/common';
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
      order: {
        prfpdto: 'ASC',
      },
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
        prfpdto: 'ASC',
      },
    });

    return performances;
  }

  async findOne(mt20id: string) {
    const performance = await this.performanceRepository.findOne({
      where: { mt20id },
      relations: ['detail'],
      select: {
        mt20id: true,
        prfnm: true,
        prfpdfrom: true,
        prfpdto: true,
        prfcast: true,
        poster: true,
        genrenm: true,
        detail: {
          fcltynm: true,
          prfstate: true,
          prfruntime: true,
          prfage: true,
          pcseguidance: true,
          dtguidance: true,
          prfcrew: true,
        },
      },
    });

    if (!performance) {
      throw new NotFoundException(`공연 ID ${mt20id}를 찾을 수 없습니다.`);
    }

    return {
      mt20id: performance.mt20id,
      prfnm: performance.prfnm,
      prfpdfrom: performance.prfpdfrom,
      prfpdto: performance.prfpdto,
      prfcast: performance.prfcast ?? null,
      poster: performance.poster,
      genrenm: performance.genrenm,
      fcltynm: performance.detail?.fcltynm ?? null,
      prfstate: performance.detail?.prfstate ?? null,
      prfruntime: performance.detail?.prfruntime ?? null,
      prfage: performance.detail?.prfage ?? null,
      pcseguidance: performance.detail?.pcseguidance ?? null,
      dtguidance: performance.detail?.dtguidance ?? null,
      prfcrew: performance.detail?.prfcrew ?? null,
    };
  }
}

