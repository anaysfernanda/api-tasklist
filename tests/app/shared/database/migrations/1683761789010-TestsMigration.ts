import { MigrationInterface, QueryRunner } from "typeorm";

export class TestsMigration1683761789010 implements MigrationInterface {
    name = 'TestsMigration1683761789010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "dthr_criacao" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id_task" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "archived" boolean NOT NULL DEFAULT (0), "dthr_criacao" datetime NOT NULL DEFAULT (datetime('now')), "dthr_atualizacao" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_tasks" ("id_task" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "archived" boolean NOT NULL DEFAULT (0), "dthr_criacao" datetime NOT NULL DEFAULT (datetime('now')), "dthr_atualizacao" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar, CONSTRAINT "FK_44fe0c59b0e8f8077b1d9c27f75" FOREIGN KEY ("id_user") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tasks"("id_task", "title", "description", "archived", "dthr_criacao", "dthr_atualizacao", "id_user") SELECT "id_task", "title", "description", "archived", "dthr_criacao", "dthr_atualizacao", "id_user" FROM "tasks"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`ALTER TABLE "temporary_tasks" RENAME TO "tasks"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" RENAME TO "temporary_tasks"`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id_task" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "archived" boolean NOT NULL DEFAULT (0), "dthr_criacao" datetime NOT NULL DEFAULT (datetime('now')), "dthr_atualizacao" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar)`);
        await queryRunner.query(`INSERT INTO "tasks"("id_task", "title", "description", "archived", "dthr_criacao", "dthr_atualizacao", "id_user") SELECT "id_task", "title", "description", "archived", "dthr_criacao", "dthr_atualizacao", "id_user" FROM "temporary_tasks"`);
        await queryRunner.query(`DROP TABLE "temporary_tasks"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
