import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  id: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column()
  nickname: string;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;
}
