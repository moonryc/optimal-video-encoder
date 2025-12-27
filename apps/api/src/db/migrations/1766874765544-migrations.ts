import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1766874765544 implements MigrationInterface {
    name = 'Migrations1766874765544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."conversion_items_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "conversion_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "progress" double precision NOT NULL DEFAULT '0', "time_remaining" double precision NOT NULL DEFAULT '0', "path" text NOT NULL, "duration" double precision NOT NULL, "is4k" boolean NOT NULL, "error" text, "status" "public"."conversion_items_status_enum" NOT NULL DEFAULT 'PENDING', "started_at" TIMESTAMP WITH TIME ZONE, "errored_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "stall_counter" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d5710986d987c193139158b470f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "conversion_items"`);
        await queryRunner.query(`DROP TYPE "public"."conversion_items_status_enum"`);
    }

}
