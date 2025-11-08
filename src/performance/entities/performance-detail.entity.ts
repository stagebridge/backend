import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Performance } from './performance.entity';

@Entity('performance_details')
export class PerformanceDetail {
  @PrimaryColumn()
  mt20id: string; // 공연ID (FK, PK)

  @OneToOne(() => Performance, (performance) => performance.detail)
  @JoinColumn({ name: 'mt20id' })
  performance: Performance;

  @Column({ nullable: true })
  fcltynm: string; // 공연시설명(공연장명)

  @Column({ nullable: true })
  mt10id: string; // 공연시설ID (FK)

  @Column({ nullable: true })
  prfstate: string; // 공연상태 (예: 공연중)

  @Column({ nullable: true, type: 'text' })
  prfcrew: string; // 공연제작진

  @Column({ nullable: true })
  prfruntime: string; // 공연 런타임 (예: 150분)

  @Column({ nullable: true })
  prfage: string; // 공연 관람 연령 (예: 8세 이상)

  @Column({ nullable: true, type: 'text' })
  pcseguidance: string; // 티켓가격

  @Column({ nullable: true, type: 'text' })
  dtguidance: string; // 공연시간

  // 소개 이미지 URL 배열 (JSON 배열로 저장)
  @Column({ type: 'jsonb', nullable: true })
  styurls: string[]; // 소개이미지 URL 목록

  // 예매처 정보 배열 (JSON 배열로 저장)
  @Column({ type: 'jsonb', nullable: true })
  ticketingAgencies: Array<{
    relatnm?: string; // 예매처명
    relateurl?: string; // 예매처URL
  }>;
}

