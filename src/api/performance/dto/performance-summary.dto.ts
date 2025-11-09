export class PerformanceSummaryDto {
  mt20id: string;
  prfnm: string; // 공연명
  prfpdfrom: string | null; // 공연시작일
  prfpdto: string | null; // 공연종료일
  prfcast: string | null; // 공연출연진
  poster: string | null; // 포스터이미지경로
}

