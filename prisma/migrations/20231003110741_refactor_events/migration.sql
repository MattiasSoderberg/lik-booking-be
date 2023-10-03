/*
  Warnings:

  - The primary key for the `addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `eventGroupId` on the `events` table. All the data in the column will be lost.
  - The `addressId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[street,zipCode,area]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId,assetId]` on the table `client_asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,clientId]` on the table `client_relative` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,eventId]` on the table `schedule_event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_clientId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_eventGroupId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_uuid_fkey";

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
ALTER TABLE "events" DROP COLUMN "eventGroupId",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isBlocking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "staffId" TEXT,
ALTER COLUMN "assetId" DROP NOT NULL,
ALTER COLUMN "clientId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "addressId",
ADD COLUMN     "addressId" INTEGER;

-- DropEnum
DROP TYPE "EventType";

-- CreateIndex
CREATE UNIQUE INDEX "addresses_street_zipCode_area_key" ON "addresses"("street", "zipCode", "area");

-- CreateIndex
CREATE UNIQUE INDEX "client_asset_clientId_assetId_key" ON "client_asset"("clientId", "assetId");

-- CreateIndex
CREATE UNIQUE INDEX "client_relative_userId_clientId_key" ON "client_relative"("userId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_event_scheduleId_eventId_key" ON "schedule_event"("scheduleId", "eventId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
