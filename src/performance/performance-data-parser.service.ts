import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';
import { PerformanceDetail } from './entities/performance-detail.entity';

@Injectable()
export class PerformanceDataParser {
  private readonly logger = new Logger(PerformanceDataParser.name);

  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(PerformanceDetail)
    private readonly performanceDetailRepository: Repository<PerformanceDetail>,
  ) {}

  extractPerformances(data: any): any[] {
    const db = data?.dbs?.db;
    if (!db) {
      return [];
    }
    return Array.isArray(db) ? db : [db];
  }

  extractDetailData(data: any): any {
    const db = data?.dbs?.db;
    if (!db) {
      return null;
    }
    return Array.isArray(db) ? db[0] : db;
  }

  extractBoxOffices(data: any): any[] {
    try {
      if (data?.dbs?.db) {
        const db = Array.isArray(data.dbs.db) ? data.dbs.db[0] : data.dbs.db;
        if (db?.returncode && db.returncode[0] !== '00') {
          const errMsg = db.errmsg?.[0] || '알 수 없는 오류';
          this.logger.warn(`KOPIS API 오류: ${errMsg}`);
          return [];
        }
      }

      const root = data?.boxofs?.boxof;
      if (!root) {
        return [];
      }
      return Array.isArray(root) ? root : [root];
    } catch (error) {
      this.logger.error('예매상황판 데이터 추출 실패', error);
      return [];
    }
  }

  getFieldValue(field: any): string | null {
    if (!field) return null;
    if (Array.isArray(field)) {
      return field[0] || null;
    }
    return field || null;
  }

  extractStyurls(data: any): string[] {
    const styurls: string[] = [];
    const styurlsData = data.styurls?.[0] || data.styurls;

    if (!styurlsData) return [];

    for (let i = 1; i <= 10; i++) {
      const url = this.getFieldValue(
        styurlsData[`styurl${i}`] || styurlsData.styurl?.[i - 1],
      );
      if (url) {
        styurls.push(url);
      }
    }

    return styurls;
  }

  extractRelates(data: any): Array<{ relatnm?: string; relateurl?: string }> {
    const relates: Array<{ relatnm?: string; relateurl?: string }> = [];

    if (!data.relates) {
      return [];
    }

    const relatesData = data.relates[0] || data.relates;
    if (!relatesData) {
      return [];
    }

    // KOPIS API 응답 구조: relatesData.relate 배열
    // 각 요소는 { relatenm: [배열], relateurl: [배열] } 형태
    const relateArray = relatesData.relate;

    if (!Array.isArray(relateArray)) {
      return [];
    }

    for (const relateItem of relateArray) {
      const relatnm = this.getFieldValue(relateItem.relatenm);
      const relateurl = this.getFieldValue(relateItem.relateurl);

      if (relatnm || relateurl) {
        relates.push({ relatnm: relatnm || undefined, relateurl: relateurl || undefined });
      }
    }

    return relates;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  parseIntValue(value: string | null): number | null {
    if (!value) return null;
    const parsed = parseInt(value.replace(/,/g, ''), 10);
    return isNaN(parsed) ? null : parsed;
  }

  async savePerformance(data: any) {
    const performanceData: Partial<Performance> = {
      mt20id: this.getFieldValue(data.mt20id) ?? undefined,
      prfnm: this.getFieldValue(data.prfnm) ?? undefined,
      prfpdfrom: this.getFieldValue(data.prfpdfrom) ?? undefined,
      prfpdto: this.getFieldValue(data.prfpdto) ?? undefined,
      prfcast: this.getFieldValue(data.prfcast) ?? undefined,
      poster: this.getFieldValue(data.poster) ?? undefined,
      genrenm: this.getFieldValue(data.genrenm) ?? undefined,
      sidonm: this.getFieldValue(data.sidonm) ?? undefined,
      gugunnm: this.getFieldValue(data.gugunnm) ?? undefined,
    };
    
    const performance = this.performanceRepository.create(performanceData);

    await this.performanceRepository.save(performance);
  }

  async savePerformanceDetail(mt20id: string, data: any) {
    const mt10id = this.getFieldValue(data.mt10id);
    const sidonm = this.getFieldValue(data.sidonm);
    const gugunnm = this.getFieldValue(data.gugunnm);

    const performanceUpdateData: any = {};

    if (mt10id) {
      performanceUpdateData.mt10id = mt10id;
    }
    if (sidonm) {
      performanceUpdateData.sidonm = sidonm;
    }
    if (gugunnm) {
      performanceUpdateData.gugunnm = gugunnm;
    }
    const prfcast = this.getFieldValue(data.prfcast);
    if (prfcast !== null) {
      performanceUpdateData.prfcast = prfcast;
    }

    if (Object.keys(performanceUpdateData).length > 0) {
      await this.performanceRepository.update(mt20id, performanceUpdateData);
    }

    const detailData: any = {
      mt20id,
    };

    const fcltynm = this.getFieldValue(data.fcltynm);
    if (fcltynm) {
      detailData.fcltynm = fcltynm;
    }
    if (mt10id) {
      detailData.mt10id = mt10id;
    }

    const prfstate = this.getFieldValue(data.prfstate);
    if (prfstate !== null) {
      detailData.prfstate = prfstate;
    }

    const detailFields = [
      'prfcrew',
      'prfruntime',
      'prfage',
      'pcseguidance',
      'dtguidance',
    ];

    for (const field of detailFields) {
      const value = this.getFieldValue(data[field]);
      if (value !== null) {
        detailData[field] = value;
      }
    }

    const styurls = this.extractStyurls(data);
    if (styurls && styurls.length > 0) {
      detailData.styurls = styurls;
    }

    const relates = this.extractRelates(data);
    if (relates && relates.length > 0) {
      detailData.ticketingAgencies = relates;
    }

    const existingDetail = await this.performanceDetailRepository.findOne({
      where: { mt20id },
    });

    if (existingDetail) {
      Object.assign(existingDetail, detailData);
      await this.performanceDetailRepository.save(existingDetail);
    } else {
      const detail = this.performanceDetailRepository.create(detailData);
      await this.performanceDetailRepository.save(detail);
    }
  }
}

