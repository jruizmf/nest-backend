import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UuidEntity } from './uuid.entity';
import { User } from './user.entity';

@Entity({ name: 'professional_profiles' })
export class ProfessionalProfile extends UuidEntity {
  @Column({ length: 50 })
  ocupation: string;

  @Column({ length: 100 })
  university: string;

  @Column({ length: 100 })
  telephone: string;

  @Column({ length: 25 })
  RFC: string;

  @Column({ length: 25 })
  professional_licence: string;

  @Column({ length: 10 })
  postal_code: string;

  @Column({ length: 50 })
  address: string;

  @Column({ length: 50 })
  neighborhood: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50 })
  state: string;

  @Column({ length: 100 })
  country: string;

  @Column({ length: 50 })
  image: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  location: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date | null;

  @Column({ type: 'timestamptz' })
  date_added: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date_modified: Date | null;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @OneToOne(() => User, (user) => user.professionalProfile, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
