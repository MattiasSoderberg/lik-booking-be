/*
  Warnings:

  - You are about to drop the `ScheduleShiftTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ScheduleShiftTask" DROP CONSTRAINT "ScheduleShiftTask_uuid_fkey";

-- DropTable
DROP TABLE "ScheduleShiftTask";

-- CreateTable
CREATE TABLE "schedule_shift_tasks" (
    "uuid" TEXT NOT NULL,
    "startAt" TIMESTAMPTZ NOT NULL,
    "endAt" TIMESTAMPTZ NOT NULL,
    "note" TEXT,

    CONSTRAINT "schedule_shift_tasks_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "schedule_shift_tasks" ADD CONSTRAINT "schedule_shift_tasks_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "schedule_shifts"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
