import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { Session } from '../entities/session.entity';
import { Configuration } from '../entities/configuration.entity';
import { ProfessionalProfile } from '../entities/professional-profile.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { Category } from '../entities/category.entity';
import { Menu } from '../entities/menu.entity';
import { SubCategory } from '../entities/subcategory.entity';

// Single source of truth for the DB connection, shared by AppModule (runtime) and
// the TypeORM CLI (migrations). The schema is owned by migrations now, so
// `synchronize` is hard-wired off - never flip it, generate a migration instead.
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    User,
    Role,
    UserRole,
    Session,
    Configuration,
    ProfessionalProfile,
    UserProfile,
    Category,
    Menu,
    SubCategory,
  ],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
  // Run pending migrations automatically on boot in dev; keep it manual in prod
  // by leaving RUN_MIGRATIONS unset there.
  migrationsRun: process.env.RUN_MIGRATIONS === 'true',
};

export default new DataSource(dataSourceOptions);
