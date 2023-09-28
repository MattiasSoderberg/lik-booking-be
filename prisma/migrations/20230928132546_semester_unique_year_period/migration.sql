/*
  Warnings:

  - A unique constraint covering the columns `[year,period]` on the table `semesters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `semesters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "semesters" ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "semesters_year_period_key" ON "semesters"("year", "period");
