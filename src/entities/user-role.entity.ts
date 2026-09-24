import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

// Maps to the join table Sequelize auto-created for User.belongsToMany(Role, { through: 'UserRoles' }).
// Modeled explicitly (rather than a plain TypeORM @JoinTable) because that table has its own
// createdAt/updatedAt columns with no DB-level default - a bare JoinTable insert would violate NOT NULL.
@Entity({ name: 'UserRoles' })
export class UserRole {
  @PrimaryColumn({ name: 'UserId' })
  userId: string;

  @PrimaryColumn({ name: 'RoleId' })
  roleId: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'RoleId' })
  role: Role;
}
