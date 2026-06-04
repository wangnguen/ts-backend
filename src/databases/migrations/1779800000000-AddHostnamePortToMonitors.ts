import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddHostnamePortToMonitors1779800000000 implements MigrationInterface {
  name = 'AddHostnamePortToMonitors1779800000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "monitors" ADD "hostname" character varying(255)`)
    await queryRunner.query(`ALTER TABLE "monitors" ADD "port" integer`)
    await queryRunner.query(`ALTER TABLE "monitors" ALTER COLUMN "target" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "monitors" ALTER COLUMN "target" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "monitors" DROP COLUMN "port"`)
    await queryRunner.query(`ALTER TABLE "monitors" DROP COLUMN "hostname"`)
  }
}
