import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UuidEntity } from './uuid.entity';
import { User } from './user.entity';

@Entity({ name: 'user_profiles' })
export class UserProfile extends UuidEntity {
  @Column({ length: 50 })
  ocupation: string;

  @Column({ length: 100 })
  university: string;

  @Column({ length: 100 })
  telephone: string;

  @Column({ length: 25 })
  RFC: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50 })
  state: string;

  @Column({ length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string | null;

  @Column({ type: 'timestamptz' })
  date_added: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date_modified: Date | null;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @OneToOne(() => User, (user) => user.userProfile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
