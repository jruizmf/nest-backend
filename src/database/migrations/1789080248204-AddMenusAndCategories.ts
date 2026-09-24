import { MigrationInterface, QueryRunner } from 'typeorm';

// First TypeORM migration. Adds the two tables that don't exist yet (menus,
// categories). The generator also proposed a lot of churn against the
// Sequelize-created tables (renaming every FK, dropping UserRoles.createdAt/
// updatedAt, forcing active NOT NULL, adding UNIQUE on the *_profiles.user_id
// columns). That is real entity/DB drift but it is deliberately left out of
// this migration - decide on it separately.
export class AddMenusAndCategories1789080248204 implements MigrationInterface {
  name = 'AddMenusAndCategories1789080248204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL, "active" boolean NOT NULL DEFAULT true, "name" character varying(20) NOT NULL, "description" character varying(50) NOT NULL, "date_added" TIMESTAMP WITH TIME ZONE NOT NULL, "date_modified" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menus" ("id" uuid NOT NULL, "active" boolean NOT NULL DEFAULT true, "name" character varying(20) NOT NULL, "description" character varying(50) NOT NULL, "date_added" TIMESTAMP WITH TIME ZONE NOT NULL, "date_modified" TIMESTAMP WITH TIME ZONE, "category_id" uuid, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "FK_83b2cc4e4e8467ea40e5cf860f3" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus" DROP CONSTRAINT "FK_83b2cc4e4e8467ea40e5cf860f3"`,
    );
    await queryRunner.query(`DROP TABLE "menus"`);
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
