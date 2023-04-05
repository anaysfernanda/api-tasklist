import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTasklist1680725129832 implements MigrationInterface {
    name = 'CreateTableTasklist1680725129832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teste"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "dthr_criacao" TIMESTAMP NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teste"."tasks" ("id_task" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL DEFAULT false, "dthr_criacao" TIMESTAMP NOT NULL DEFAULT now(), "dthr_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "id_user" uuid, CONSTRAINT "PK_922a566ff90ce84d3e030604590" PRIMARY KEY ("id_task"))`);
        await queryRunner.query(`ALTER TABLE "teste"."tasks" ADD CONSTRAINT "FK_44fe0c59b0e8f8077b1d9c27f75" FOREIGN KEY ("id_user") REFERENCES "teste"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teste"."tasks" DROP CONSTRAINT "FK_44fe0c59b0e8f8077b1d9c27f75"`);
        await queryRunner.query(`DROP TABLE "teste"."tasks"`);
        await queryRunner.query(`DROP TABLE "teste"."user"`);
    }

}
