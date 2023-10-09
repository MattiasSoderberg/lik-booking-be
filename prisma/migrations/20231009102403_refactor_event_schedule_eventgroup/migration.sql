/*
  Warnings:

  - The primary key for the `event_groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `event_groups` table. All the data in the column will be lost.
  - You are about to drop the column `creatingStaffId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `updatingStaffId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `schedule_event` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[startAt,weekday,semesterId]` on the table `event_groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staffId]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semesterId` to the `event_groups` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `event_groups` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `weekday` to the `event_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SemesterPlan" ADD VALUE 'STAFF';

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_creatingStaffId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_updatingStaffId_fkey";

-- DropForeignKey
ALTER TABLE "schedule_event" DROP CONSTRAINT "schedule_event_eventId_fkey";

-- DropForeignKey
ALTER TABLE "schedule_event" DROP CONSTRAINT "schedule_event_scheduleId_fkey";

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
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "eventGroupId" TEXT,
ADD COLUMN     "scheduleId" TEXT,
ADD COLUMN     "updatedById" TEXT,
ALTER COLUMN "startAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "endAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "staffId" TEXT,
ALTER COLUMN "clientId" DROP NOT NULL;

-- DropTable
DROP TABLE "schedule_event";

-- CreateIndex
CREATE UNIQUE INDEX "event_groups_startAt_weekday_semesterId_key" ON "event_groups"("startAt", "weekday", "semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_staffId_key" ON "schedules"("staffId");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "event_groups"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_groups" ADD CONSTRAINT "event_groups_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semesters"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
