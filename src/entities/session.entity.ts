import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UuidEntity } from './uuid.entity';
import { User } from './user.entity';

@Entity({ name: 'sessions' })
export class Session extends UuidEntity {
  // Matches the live column: varchar(2000). The original was varchar(600); it was
  // widened on ALT_ServiceApp because the JWT now embeds roles/profile data
  // (see AuthService.login) and can exceed 600 characters.
  @Column({ type: 'varchar', length: 2000 })
  token: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamptz' })
  date_added: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date_modified: Date | null;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
