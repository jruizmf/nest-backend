import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UuidEntity } from './uuid.entity';
import { Category } from './category.entity';

@Entity({ name: 'menus' })
export class Menu extends UuidEntity {
  @Column({ default: true })
  active!: boolean;

  @Column({ length: 20 })
  name!: string;

  @Column({ length: 250 })
  description!: string;

  @Column({ type: 'timestamptz' })
  date_added!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date_modified!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  category_id!: string | null;

  @ManyToOne(() => Category, (category) => category.menus, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;
}
