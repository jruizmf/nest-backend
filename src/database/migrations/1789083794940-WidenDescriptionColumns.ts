import { MigrationInterface, QueryRunner } from 'typeorm';

// Widen description from varchar(50) to varchar(250) on categories, subcategories
// and menus. Done as an in-place ALTER COLUMN TYPE (no data loss); the generator's
// DROP + ADD proposal would have wiped existing rows. Unrelated Sequelize-schema
// drift the generator also picked up is left out on purpose.
export class WidenDescriptionColumns1789083794940 implements MigrationInterface {
  name = 'WidenDescriptionColumns1789083794940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "description" TYPE character varying(250)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" ALTER COLUMN "description" TYPE character varying(250)`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ALTER COLUMN "description" TYPE character varying(250)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Fails if any row's description is longer than 50 chars.
    await queryRunner.query(
      `ALTER TABLE "menus" ALTER COLUMN "description" TYPE character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" ALTER COLUMN "description" TYPE character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "description" TYPE character varying(50)`,
    );
  }
}
