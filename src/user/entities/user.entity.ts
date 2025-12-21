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

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  email: string;
}
