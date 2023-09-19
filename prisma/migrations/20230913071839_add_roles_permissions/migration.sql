/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientAsset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientRelative` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Semester` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClientAsset" DROP CONSTRAINT "ClientAsset_assetId_fkey";

-- DropForeignKey
ALTER TABLE "ClientAsset" DROP CONSTRAINT "ClientAsset_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientRelative" DROP CONSTRAINT "ClientRelative_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientRelative" DROP CONSTRAINT "ClientRelative_userId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_creatingStaffId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_updatingStaffId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleEvent" DROP CONSTRAINT "ScheduleEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleEvent" DROP CONSTRAINT "ScheduleEvent_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_uuid_fkey";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Asset";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "ClientAsset";

-- DropTable
DROP TABLE "ClientRelative";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventGroup";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "ScheduleEvent";

-- DropTable
DROP TABLE "Semester";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "conditions" JSONB,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "addresses" (
    "uuid" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "area" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "clients" (
    "uuid" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bornAt" DATE NOT NULL,
    "userId" TEXT,
    "note" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "client_relative" (
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "client_asset" (
    "clientId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "assets" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "semesters" (
    "uuid" TEXT NOT NULL,
    "startAt" DATE NOT NULL,
    "endAt" DATE NOT NULL,
    "period" "SemesterPeriod" NOT NULL,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "schedules" (
    "uuid" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "semesterPlan" "SemesterPlan" NOT NULL,
    "semesterId" TEXT NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "schedule_event" (
    "scheduleId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "events" (
    "uuid" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatingStaffId" TEXT NOT NULL,
    "updatingStaffId" TEXT,
    "eventGroupId" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "event_groups" (
    "id" SERIAL NOT NULL,
    "startAt" TIME NOT NULL,
    "endAt" TIME NOT NULL,

    CONSTRAINT "event_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_userId_key" ON "clients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "client_relative_userId_key" ON "client_relative"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "client_relative_clientId_key" ON "client_relative"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "client_asset_clientId_key" ON "client_asset"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "client_asset_assetId_key" ON "client_asset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "assets_name_key" ON "assets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_event_scheduleId_key" ON "schedule_event"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_event_eventId_key" ON "schedule_event"("eventId");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_relative" ADD CONSTRAINT "client_relative_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_relative" ADD CONSTRAINT "client_relative_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_asset" ADD CONSTRAINT "client_asset_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_asset" ADD CONSTRAINT "client_asset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semesters"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_event" ADD CONSTRAINT "schedule_event_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_event" ADD CONSTRAINT "schedule_event_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_creatingStaffId_fkey" FOREIGN KEY ("creatingStaffId") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_updatingStaffId_fkey" FOREIGN KEY ("updatingStaffId") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "event_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
