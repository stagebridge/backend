import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';

class MainPerformanceItemDto {
  @ApiProperty({
    description: '공연명',
    example: '정선아리랑 토요상설공연: 뗏꾼',
  })
  prfnm: string;

  @ApiProperty({
    description: '공연 시작일',
    example: '2025.04.05',
    nullable: true,
  })
  prfpdfrom: string | null;

  @ApiProperty({
    description: '공연 종료일',
    example: '2025.11.22',
    nullable: true,
  })
  prfpdto: string | null;

  @ApiProperty({
    description: '공연 출연진',
    example: '홍동주, 최진실, 이재욱',
    nullable: true,
  })
  prfcast: string | null;

  @ApiProperty({
    description: '포스터 이미지 URL',
    example: 'http://www.kopis.or.kr/upload/pfmPoster/PF_PF277653_251029_130842.png',
    nullable: true,
  })
  poster: string | null;
}

export class MainPerformanceDataDto {
  @ApiProperty({
    description: '순위별 공연 목록 (모든 장르, 순위가 있는 공연만)',
    type: [MainPerformanceItemDto],
  })
  ranked: MainPerformanceItemDto[];

  @ApiProperty({
    description: '장르별 공연 목록 (지정한 장르의 모든 공연, 순위순 정렬)',
    type: [MainPerformanceItemDto],
  })
  byGenre: MainPerformanceItemDto[];
}

export class MainPerformanceResponseDto {
  @ApiProperty({
    description: '응답 메시지',
    example: '메인 화면 공연 목록을 성공적으로 조회했습니다.',
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: MainPerformanceDataDto,
  })
  data: MainPerformanceDataDto;
}

