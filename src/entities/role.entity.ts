import { Column, Entity, OneToMany } from 'typeorm';
import { UuidEntity } from './uuid.entity';
import { UserRole } from './user-role.entity';

@Entity({ name: 'roles' })
export class Role extends UuidEntity {
  @Column({ default: true })
  active: boolean;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 50 })
  description: string;

  @Column({ type: 'timestamptz' })
  date_added: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date_modified: Date | null;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
