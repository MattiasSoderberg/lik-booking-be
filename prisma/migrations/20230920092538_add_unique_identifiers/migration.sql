/*
  Warnings:

  - A unique constraint covering the columns `[clientId,assetId]` on the table `client_asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,clientId]` on the table `client_relative` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,eventId]` on the table `schedule_event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "client_asset_assetId_key";

-- DropIndex
DROP INDEX "client_asset_clientId_key";

-- DropIndex
DROP INDEX "client_relative_clientId_key";

-- DropIndex
DROP INDEX "client_relative_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "client_asset_clientId_assetId_key" ON "client_asset"("clientId", "assetId");

-- CreateIndex
CREATE UNIQUE INDEX "client_relative_userId_clientId_key" ON "client_relative"("userId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_event_scheduleId_eventId_key" ON "schedule_event"("scheduleId", "eventId");
