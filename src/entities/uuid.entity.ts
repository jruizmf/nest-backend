import { randomUUID } from 'crypto';
import { BeforeInsert, PrimaryColumn } from 'typeorm';

// The live schema (created by the original Sequelize migrations, not TypeORM's
// synchronize - see app.module.ts) has no DB-level default on `id`; Sequelize
// generated UUIDs in JS before insert. @PrimaryGeneratedColumn('uuid') assumes
// the database generates it, so TypeORM omits the column from INSERT entirely -
// against this schema that means a NULL id and a NOT NULL violation. Generating
// it here, client-side, matches what the schema actually expects.
export abstract class UuidEntity {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    this.id ??= randomUUID();
  }
}
