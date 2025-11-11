import { ApiProperty } from '@nestjs/swagger';

export class PerformanceSummaryDto {
  @ApiProperty({
    description: '공연 ID',
    example: 'PF277653',
  })
  mt20id: string;

  @ApiProperty({
    description: '공연명',
    example: '정선아리랑 토요상설공연: 뗏꾼',
  })
  prfnm: string;

  @ApiProperty({
    description: '공연 시작일',
    example: '2025-04-05T00:00:00.000Z',
    type: Date,
  })
  prfpdfrom: Date;

  @ApiProperty({
    description: '공연 종료일',
    example: '2025-11-22T00:00:00.000Z',
    type: Date,
  })
  prfpdto: Date;

  @ApiProperty({
    description: '공연 출연진',
    example: '홍동주, 최진실, 이재욱',
    nullable: true,
  })
  prfcast: string | null;

  @ApiProperty({
    description: '포스터 이미지 URL',
    example: 'http://www.kopis.or.kr/upload/pfmPoster/PF_PF277653_251029_130842.png',
  })
  poster: string;
}

