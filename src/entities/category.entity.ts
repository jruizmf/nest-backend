import { Column, Entity, OneToMany } from 'typeorm';
import { UuidEntity } from './uuid.entity';
import { Menu } from './menu.entity';
import { SubCategory } from './subcategory.entity';

@Entity({ name: 'categories' })
export class Category extends UuidEntity {
  @Column({ default: true })
  active!: boolean;

  @Column({ length: 20 })
  name!: string;

  @Column({ length: 250 })
  description!: string;

  @Column({ type: 'timestamptz' })
  date_added!: Date;
  @Column({ default: true })
  hasSubcategory!: boolean;
  @Column({ type: 'timestamptz', nullable: true })
  date_modified!: Date | null;

  @OneToMany(() => Menu, (menu) => menu.category)
  menus!: Menu[];

  @OneToMany(() => SubCategory, (subcategory) => subcategory.category)
  subcategories!: SubCategory[];
}
