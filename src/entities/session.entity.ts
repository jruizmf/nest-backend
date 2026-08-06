import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UuidEntity } from './uuid.entity';
import { User } from './user.entity';

@Entity({ name: 'sessions' })
export class Session extends UuidEntity {
  // text, not varchar(600) like the original - the JWT now embeds roles/profile
  // data (see AuthService.login), which routinely exceeds 600 characters.
  @Column({ type: 'text' })
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
