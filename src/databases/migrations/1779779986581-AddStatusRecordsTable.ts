import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddStatusRecordsTable1779779986581 implements MigrationInterface {
  name = 'AddStatusRecordsTable1779779986581'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."status_records_status_enum" AS ENUM('up', 'down', 'pending')`)
    await queryRunner.query(
      `CREATE TABLE "status_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status" "public"."status_records_status_enum" NOT NULL, "latency" integer, "status_code" integer, "message" text, "checked_at" TIMESTAMP NOT NULL, "monitor_id" uuid NOT NULL, CONSTRAINT "PK_7af555600184b1b996e8e6bfb4f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "status_records" ADD CONSTRAINT "FK_e1d311b8578c1cfe38ba3a240a6" FOREIGN KEY ("monitor_id") REFERENCES "monitors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "status_records" DROP CONSTRAINT "FK_e1d311b8578c1cfe38ba3a240a6"`)
    await queryRunner.query(`DROP TABLE "status_records"`)
    await queryRunner.query(`DROP TYPE "public"."status_records_status_enum"`)
  }
}
