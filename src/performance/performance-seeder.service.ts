import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';
import { PerformanceDetail } from './entities/performance-detail.entity';
import { KopisService } from '../external/kopis/kopis.service';
import { PerformanceDataParser } from './performance-data-parser.service';

@Injectable()
export class PerformanceSeederService {
  private readonly logger = new Logger(PerformanceSeederService.name);

  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(PerformanceDetail)
    private readonly performanceDetailRepository: Repository<PerformanceDetail>,
    private readonly kopisService: KopisService,
    private readonly dataParser: PerformanceDataParser,
  ) {}

  async seedPerformanceData(params?: {
    stdate?: string;
    eddate?: string;
    rows?: number;
  }) {
    this.logger.log('공연 데이터 수집 시작...');

    try {
      const today = new Date();
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const stdate = params?.stdate || this.dataParser.formatDate(oneMonthAgo);
      const eddate = params?.eddate || this.dataParser.formatDate(today);
      const rows = params?.rows || 100;

      let page = 1;
      let totalSaved = 0;
      let hasMoreData = true;

      while (hasMoreData) {
        this.logger.log(`페이지 ${page} 조회 중...`);

        const data = await this.kopisService.getPerformanceList({
          stdate,
          eddate,
          cpage: page,
          rows,
        });

        const performances = this.dataParser.extractPerformances(data);

        if (!performances || performances.length === 0) {
          this.logger.log('더 이상 데이터가 없습니다.');
          hasMoreData = false;
          break;
        }

        for (const item of performances) {
          const prfstate = item.prfstate?.[0] || item.prfstate;
          if (prfstate === '공연완료') {
            continue;
          }

          await this.dataParser.savePerformance(item);
          totalSaved++;
        }

        this.logger.log(`페이지 ${page} 처리 완료 (${performances.length}개)`);

        if (performances.length < rows) {
          hasMoreData = false;
        } else {
          page++;
          await this.delay(1000);
        }
      }

      this.logger.log(`공연 데이터 수집 완료! 총 ${totalSaved}개 저장됨`);
      return { success: true, totalSaved };
    } catch (error) {
      this.logger.error('공연 데이터 수집 실패', error);
      throw error;
    }
  }

  async seedPerformanceDetails(limit?: number) {
    this.logger.log('공연 상세 정보 수집 시작...');

    try {
      const performances = await this.performanceRepository.find({
        take: limit,
      });

      this.logger.log(`총 ${performances.length}개의 공연 상세 정보를 수집합니다.`);

      let totalUpdated = 0;

      for (const performance of performances) {
        const detailData = await this.kopisService.getPerformanceDetail(
          performance.mt20id,
        );

        const db = this.dataParser.extractDetailData(detailData);
        if (!db) {
          continue;
        }

        await this.dataParser.savePerformanceDetail(performance.mt20id, db);
        totalUpdated++;
        await this.delay(1000);
      }

      this.logger.log(`공연 상세 정보 수집 완료! ${totalUpdated}개 업데이트`);
      return { success: true, totalUpdated };
    } catch (error) {
      this.logger.error('공연 상세 정보 수집 실패', error);
      throw error;
    }
  }

  async seedBoxOffice(params?: {
    stdate?: string;
    eddate?: string;
    catecode?: string;
    area?: string;
    srchseatscale?: string;
  }) {
    this.logger.log('예매상황판 순위 데이터 수집 시작...');

    try {
      if (!params?.stdate || !params?.eddate) {
        throw new Error('stdate와 eddate는 필수입니다.');
      }

      let stdate = params.stdate;
      let eddate = params.eddate;

      const stdateObj = new Date(
        parseInt(stdate.substring(0, 4)),
        parseInt(stdate.substring(4, 6)) - 1,
        parseInt(stdate.substring(6, 8)),
      );
      const eddateObj = new Date(
        parseInt(eddate.substring(0, 4)),
        parseInt(eddate.substring(4, 6)) - 1,
        parseInt(eddate.substring(6, 8)),
      );
      const daysDiff = Math.ceil(
        (eddateObj.getTime() - stdateObj.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff > 31) {
        this.logger.warn(
          `기간이 31일을 초과합니다 (${daysDiff}일). 마지막 31일로 제한합니다.`,
        );
        const limitedStartDate = new Date(eddateObj);
        limitedStartDate.setDate(limitedStartDate.getDate() - 30);
        stdate = this.dataParser.formatDate(limitedStartDate);
      }

      this.logger.log(`기간: ${stdate} ~ ${eddate}`);

      const data = await this.kopisService.getBoxOffice({
        stdate,
        eddate,
        catecode: params?.catecode,
        area: params?.area,
        srchseatscale: params?.srchseatscale,
      });

      const boxOffices = this.dataParser.extractBoxOffices(data);

      if (!boxOffices || boxOffices.length === 0) {
        this.logger.log('예매상황판 데이터가 없습니다.');
        return { success: true, totalUpdated: 0 };
      }

      this.logger.log(`예매상황판에서 총 ${boxOffices.length}개의 공연 데이터를 받았습니다.`);

      let totalUpdated = 0;

      for (const item of boxOffices) {
        const mt20id = this.dataParser.getFieldValue(item.mt20id);
        if (!mt20id) {
          continue;
        }

        const performance = await this.performanceRepository.findOne({
          where: { mt20id },
        });

        // DB에 없으면 건너뜀
        if (!performance) {
          continue;
        }

        // 순위 업데이트
        const rnum = this.dataParser.parseIntValue(
          this.dataParser.getFieldValue(item.rnum),
        );
        if (rnum !== null) {
          await this.performanceRepository.update(mt20id, { rnum });
          totalUpdated++;
        }
      }

      this.logger.log(`예매상황판 순위 업데이트 완료! ${totalUpdated}개 업데이트`);
      return { success: true, totalUpdated };
    } catch (error) {
      this.logger.error('예매상황판 순위 수집 실패', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

