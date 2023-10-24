/*
  Warnings:

  - The values [ACTIVE,BLOCKING] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `addresses` table. All the data in the column will be lost.
  - The primary key for the `event_groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `event_groups` table. All the data in the column will be lost.
  - You are about to drop the column `creatingStaffId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `updatingStaffId` on the `events` table. All the data in the column will be lost.
  - The `addressId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `schedule_event` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[street,zipCode,area]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId,assetId]` on the table `client_asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,clientId]` on the table `client_relative` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[startAt,endAt,weekday,semesterId]` on the table `event_groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleFor,semesterId]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[year,period]` on the table `semesters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semesterId` to the `event_groups` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `event_groups` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `weekday` to the `event_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleFor` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `semesters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('STAFF', 'CLIENT');
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "SemesterPlan" ADD VALUE 'STAFF';

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_clientId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_creatingStaffId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_eventGroupId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_updatingStaffId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_uuid_fkey";

-- DropForeignKey
ALTER TABLE "schedule_event" DROP CONSTRAINT "schedule_event_eventId_fkey";

-- DropForeignKey
ALTER TABLE "schedule_event" DROP CONSTRAINT "schedule_event_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_addressId_fkey";

-- DropIndex
DROP INDEX "client_asset_assetId_key";

-- DropIndex
DROP INDEX "client_asset_clientId_key";

-- DropIndex
DROP INDEX "client_relative_clientId_key";

-- DropIndex
DROP INDEX "client_relative_userId_key";

-- AlterTable
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "event_groups" DROP CONSTRAINT "event_groups_pkey",
DROP COLUMN "id",
ADD COLUMN     "semesterId" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD COLUMN     "weekday" SMALLINT NOT NULL,
ALTER COLUMN "startAt" SET DATA TYPE TEXT,
ALTER COLUMN "endAt" SET DATA TYPE TEXT,
ADD CONSTRAINT "event_groups_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "events" DROP COLUMN "creatingStaffId",
DROP COLUMN "updatingStaffId",
ADD COLUMN     "clientScheduleId" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isBlocking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduleShiftId" TEXT,
ADD COLUMN     "staffId" TEXT,
ADD COLUMN     "updatedById" TEXT,
ALTER COLUMN "assetId" DROP NOT NULL,
ALTER COLUMN "clientId" DROP NOT NULL,
ALTER COLUMN "startAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "endAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "eventGroupId" DROP NOT NULL,
ALTER COLUMN "eventGroupId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "eventGroupId" TEXT,
ADD COLUMN     "scheduleFor" TEXT NOT NULL,
ADD COLUMN     "staffId" TEXT,
ALTER COLUMN "clientId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "semesters" ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "addressId",
ADD COLUMN     "addressId" INTEGER;

-- DropTable
DROP TABLE "schedule_event";

-- CreateTable
CREATE TABLE "schedule_shifts" (
    "uuid" TEXT NOT NULL,
    "startAt" TIMESTAMPTZ NOT NULL,
    "endAt" TIMESTAMPTZ NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "dateIdentifier" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "userId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "schedule_shifts_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ScheduleShiftTask" (
    "uuid" TEXT NOT NULL,
    "startAt" TIMESTAMPTZ NOT NULL,
    "endAt" TIMESTAMPTZ NOT NULL,
    "note" TEXT,

    CONSTRAINT "ScheduleShiftTask_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "schedule_shifts_userId_dateIdentifier_key" ON "schedule_shifts"("userId", "dateIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_street_zipCode_area_key" ON "addresses"("street", "zipCode", "area");

-- CreateIndex
CREATE UNIQUE INDEX "client_asset_clientId_assetId_key" ON "client_asset"("clientId", "assetId");

-- CreateIndex
CREATE UNIQUE INDEX "client_relative_userId_clientId_key" ON "client_relative"("userId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "event_groups_startAt_endAt_weekday_semesterId_key" ON "event_groups"("startAt", "endAt", "weekday", "semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_scheduleFor_semesterId_key" ON "schedules"("scheduleFor", "semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_year_period_key" ON "semesters"("year", "period");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "event_groups"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_shifts" ADD CONSTRAINT "schedule_shifts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_shifts" ADD CONSTRAINT "schedule_shifts_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_shifts" ADD CONSTRAINT "schedule_shifts_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleShiftTask" ADD CONSTRAINT "ScheduleShiftTask_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "schedule_shifts"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_scheduleShiftId_fkey" FOREIGN KEY ("scheduleShiftId") REFERENCES "schedule_shifts"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_clientScheduleId_fkey" FOREIGN KEY ("clientScheduleId") REFERENCES "schedules"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "event_groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_groups" ADD CONSTRAINT "event_groups_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semesters"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
