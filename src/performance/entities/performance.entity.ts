import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PerformanceDetail } from './performance-detail.entity';

@Entity('performances')
@Index(['genrenm']) // 장르별 검색 최적화
@Index(['sidonm', 'gugunnm']) // 지역별 검색 최적화
@Index(['rnum']) // 순위별 검색 최적화
export class Performance {
  @PrimaryColumn()
  mt20id: string; // 공연ID

  // 초기 화면에 표시할 기본 정보
  @Column()
  prfnm: string; // 공연명

  @Column()
  prfpdfrom: string; // 공연시작일 (예: 2021.08.21)

  @Column()
  prfpdto: string; // 공연종료일 (예: 2024.09.29)

  @Column({ nullable: true, type: 'text' })
  prfcast: string; // 공연출연진

  @Column({ type: 'text' })
  poster: string; // 포스터이미지경로

  // 검색 최적화를 위한 필드 (장르, 지역, 순위)
  @Column()
  genrenm: string; // 공연 장르명 (장르별 검색용)

  @Column({ nullable: true })
  sidonm: string; // 지역(시도) (지역별 검색용)

  @Column({ nullable: true })
  gugunnm: string; // 지역(구군) (지역별 검색용)

  @Column({ type: 'int', nullable: true })
  rnum: number; // 순위 (순위별 검색용)

  @Column()
  mt10id: string; // 공연시설ID (참조용)

  // 관계 설정
  @OneToOne(() => PerformanceDetail, (detail) => detail.performance, {
    nullable: true,
    cascade: true,
  })
  detail: PerformanceDetail;
}

