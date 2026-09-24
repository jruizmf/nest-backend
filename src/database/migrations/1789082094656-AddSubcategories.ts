import { MigrationInterface, QueryRunner } from 'typeorm';

// Adds the subcategories table and the categories.hasSubcategory flag.
// The generator's proposed churn against the Sequelize-created tables (FK
// renames, dropping UserRoles.createdAt/updatedAt, active NOT NULL, UNIQUE on
// *_profiles.user_id) is deliberately left out - handle that drift separately.
export class AddSubcategories1789082094656 implements MigrationInterface {
  name = 'AddSubcategories1789082094656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "hasSubcategory" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `CREATE TABLE "subcategories" ("id" uuid NOT NULL, "active" boolean NOT NULL DEFAULT true, "name" character varying(20) NOT NULL, "description" character varying(50) NOT NULL, "date_added" TIMESTAMP WITH TIME ZONE NOT NULL, "date_modified" TIMESTAMP WITH TIME ZONE, "category_id" uuid, CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD CONSTRAINT "FK_f7b015bc580ae5179ba5a4f42ec" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subcategories" DROP CONSTRAINT "FK_f7b015bc580ae5179ba5a4f42ec"`,
    );
    await queryRunner.query(`DROP TABLE "subcategories"`);
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "hasSubcategory"`,
    );
  }
}
