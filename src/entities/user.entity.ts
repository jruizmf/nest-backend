import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UuidEntity } from './uuid.entity';
import { UserRole } from './user-role.entity';
import { Session } from './session.entity';
import { ProfessionalProfile } from './professional-profile.entity';
import { UserProfile } from './user-profile.entity';

@Entity({ name: 'users' })
export class User extends UuidEntity {
  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  surname: string;

  @Column({ length: 25, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Exclude()
  @Column({ length: 100 })
  password: string;

  @Column({ type: 'timestamptz' })
  date_added: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date_modified: Date | null;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToOne(() => ProfessionalProfile, (profile) => profile.user)
  professionalProfile: ProfessionalProfile;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  userProfile: UserProfile;
}
