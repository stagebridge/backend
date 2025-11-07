import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseString } from 'xml2js';

@Injectable()
export class KopisService {
  private readonly logger = new Logger(KopisService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'http://www.kopis.or.kr/openApi/restful';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('KOPIS_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn('KOPIS_API_KEY가 설정되지 않았습니다.');
    }
  }

  async getPerformanceList(params: {
    stdate: string; // 공연시작일자 (YYYYMMDD) - 필수
    eddate: string; // 공연종료일자 (YYYYMMDD) - 필수
    cpage: number; // 현재페이지 - 필수
    rows: number; // 페이지당 목록 수 (최대 100) - 필수
    shprfnm?: string; // 공연명 (선택)
    shprfnmfct?: string; // 공연시설명 (선택)
    shcate?: string; // 장르코드 (선택)
    prfplccd?: string; // 공연장코드 (선택)
    signgucode?: string; // 지역(시도)코드 (선택)
    signgucodesub?: string; // 지역(구군)코드 (선택)
    kidstate?: string; // 아동공연여부 (Y/N) (선택)
    prfstate?: string; // 공연상태코드 (선택)
    openrun?: string; // 오픈런 (Y/N) (선택)
  }) {
    try {
      const queryParams = new URLSearchParams({
        service: this.apiKey,
        stdate: params.stdate,
        eddate: params.eddate,
        cpage: params.cpage.toString(),
        rows: params.rows.toString(),
      });

      // 선택 파라미터 추가
      if (params.shprfnm) {
        queryParams.append('shprfnm', encodeURIComponent(params.shprfnm));
      }
      if (params.shprfnmfct) {
        queryParams.append('shprfnmfct', encodeURIComponent(params.shprfnmfct));
      }
      if (params.shcate) {
        queryParams.append('shcate', params.shcate);
      }
      if (params.prfplccd) {
        queryParams.append('prfplccd', params.prfplccd);
      }
      if (params.signgucode) {
        queryParams.append('signgucode', params.signgucode);
      }
      if (params.signgucodesub) {
        queryParams.append('signgucodesub', params.signgucodesub);
      }
      if (params.kidstate) {
        queryParams.append('kidstate', params.kidstate);
      }
      if (params.prfstate) {
        queryParams.append('prfstate', params.prfstate);
      }
      if (params.openrun) {
        queryParams.append('openrun', params.openrun);
      }

      const url = `${this.baseUrl}/pblprfr?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlText = await response.text();

      // XML을 JSON으로 파싱
      const parsedData = await this.parseXml(xmlText);

      // 결과 코드 확인
      const resultCode = parsedData?.dbs?.resultCode?.[0];
      if (resultCode && resultCode !== '00') {
        const errorMsg = this.getErrorMessage(resultCode);
        throw new Error(`KOPIS API 오류 (코드: ${resultCode}): ${errorMsg}`);
      }

      return parsedData;
    } catch (error) {
      this.logger.error('KOPIS API 호출 실패', error);
      throw error;
    }
  }

  private parseXml(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xml, { explicitArray: true }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async getPerformanceDetail(mt20id: string) {
    try {
      const queryParams = new URLSearchParams({
        service: this.apiKey,
      });

      const url = `${this.baseUrl}/pblprfr/${mt20id}?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlText = await response.text();

      // XML을 JSON으로 파싱
      const parsedData = await this.parseXml(xmlText);

      // 결과 코드 확인
      const resultCode = parsedData?.dbs?.resultCode?.[0];
      if (resultCode && resultCode !== '00') {
        const errorMsg = this.getErrorMessage(resultCode);
        throw new Error(`KOPIS API 오류 (코드: ${resultCode}): ${errorMsg}`);
      }

      return parsedData;
    } catch (error) {
      this.logger.error('KOPIS API 상세 조회 실패', error);
      throw error;
    }
  }

  async getBoxOffice(params: {
    stdate: string; // 시작일자 (YYYYMMDD) - 필수
    eddate: string; // 종료일자 (YYYYMMDD) - 필수 (최대 31일)
    catecode?: string; // 장르 구분 코드 (선택)
    area?: string; // 지역 코드 (선택)
    srchseatscale?: string; // 좌석수 (선택)
  }) {
    try {
      const queryParams = new URLSearchParams({
        service: this.apiKey,
        stdate: params.stdate,
        eddate: params.eddate,
      });

      // 선택 파라미터 추가
      if (params.catecode) {
        queryParams.append('catecode', params.catecode);
      }
      if (params.area) {
        queryParams.append('area', params.area);
      }
      if (params.srchseatscale) {
        queryParams.append('srchseatscale', params.srchseatscale);
      }

      const url = `${this.baseUrl}/boxoffice?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlText = await response.text();

      // XML을 JSON으로 파싱
      const parsedData = await this.parseXml(xmlText);

      // 결과 코드 확인
      const resultCode = parsedData?.dbs?.resultCode?.[0];
      if (resultCode && resultCode !== '00') {
        const errorMsg = this.getErrorMessage(resultCode);
        throw new Error(`KOPIS API 오류 (코드: ${resultCode}): ${errorMsg}`);
      }

      return parsedData;
    } catch (error) {
      this.logger.error('KOPIS API 예매상황판 호출 실패', error);
      throw error;
    }
  }

  private getErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
      '01': 'INVALID REQUEST PARAMETER ERROR',
      '02': 'SERVICE KEY IS NOT REGISTERED ERROR',
      '03': 'DB_ERROR',
      '04': 'NODATA ERROR',
      '05': '최대 31일까지 조회가능합니다.',
      '06': '최대 조회수는 100건까지 가능합니다.',
    };
    return errorMessages[code] || '알 수 없는 오류';
  }
}

