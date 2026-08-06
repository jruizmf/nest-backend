import { Column, Entity } from 'typeorm';
import { UuidEntity } from './uuid.entity';

@Entity({ name: 'configurations' })
export class Configuration extends UuidEntity {
  @Column({ length: 50 })
  identifier: string;

  @Column({ length: 100 })
  code: string;

  @Column({ length: 100 })
  value: string;

  @Column({ type: 'timestamptz' })
  date_added: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date_modified: Date | null;
}
