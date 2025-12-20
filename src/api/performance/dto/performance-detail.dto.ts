import { ApiProperty } from '@nestjs/swagger';

export class PerformanceDetailDto {
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

  @ApiProperty({
    description: '공연장르',
    example: '대중음악',
  })
  genrenm: string;

  @ApiProperty({
    description: '공연장소',
    example: '정선아리랑센터',
    nullable: true,
  })
  fcltynm: string | null;

  @ApiProperty({
    description: '공연상태',
    example: '공연중',
    nullable: true,
  })
  prfstate: string | null;

  @ApiProperty({
    description: '공연 런타임',
    example: '150분',
    nullable: true,
  })
  prfruntime: string | null;

  @ApiProperty({
    description: '관람연령',
    example: '8세 이상',
    nullable: true,
  })
  prfage: string | null;

  @ApiProperty({
    description: '가격',
    example: 'VIP석 150,000원, R석 100,000원',
    nullable: true,
  })
  pcseguidance: string | null;

  @ApiProperty({
    description: '상영시간대',
    example: '화~일 19:30, 토 15:00',
    nullable: true,
  })
  dtguidance: string | null;

  @ApiProperty({
    description: '공연 제작진',
    example: '연출: 홍길동, 작곡: 김철수',
    nullable: true,
  })
  prfcrew: string | null;

  @ApiProperty({
    description: '소개 이미지 URL 목록',
    example: [
      'http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF277653_251029_130842.jpg',
      'http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF277653_251029_130843.jpg',
    ],
    type: [String],
    isArray: true,
    nullable: true,
  })
  styurls: string[] | null;
}

