import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotes1696996329868 implements MigrationInterface {
    name = 'UpdateNotes1696996329868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" ADD "text" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "status" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "text"`);
    }

}
