-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'RELATIVE', 'STAFF');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SemesterPeriod" AS ENUM ('SPRING', 'FALL');

-- CreateEnum
CREATE TYPE "SemesterPlan" AS ENUM ('FULL', 'HALF');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('ACTIVE', 'BLOCKING');

-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "phoneNumber" TEXT,
    "role" "Role" NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Client" (
    "uuid" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bornAt" DATE NOT NULL,
    "userId" TEXT,
    "note" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ClientRelative" (
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "ClientAsset" (
    "clientId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "Asset" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Semester" (
    "uuid" TEXT NOT NULL,
    "startAt" DATE NOT NULL,
    "endAt" DATE NOT NULL,
    "period" "SemesterPeriod" NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "uuid" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "semesterPlan" "SemesterPlan" NOT NULL,
    "semesterId" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ScheduleEvent" (
    "scheduleId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "Event" (
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

    CONSTRAINT "Event_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "EventGroup" (
    "id" SERIAL NOT NULL,
    "startAt" TIME NOT NULL,
    "endAt" TIME NOT NULL,

    CONSTRAINT "EventGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientRelative_userId_key" ON "ClientRelative"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientRelative_clientId_key" ON "ClientRelative"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAsset_clientId_key" ON "ClientAsset"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAsset_assetId_key" ON "ClientAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_name_key" ON "Asset"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleEvent_scheduleId_key" ON "ScheduleEvent"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleEvent_eventId_key" ON "ScheduleEvent"("eventId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientRelative" ADD CONSTRAINT "ClientRelative_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientRelative" ADD CONSTRAINT "ClientRelative_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAsset" ADD CONSTRAINT "ClientAsset_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAsset" ADD CONSTRAINT "ClientAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleEvent" ADD CONSTRAINT "ScheduleEvent_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleEvent" ADD CONSTRAINT "ScheduleEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatingStaffId_fkey" FOREIGN KEY ("creatingStaffId") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_updatingStaffId_fkey" FOREIGN KEY ("updatingStaffId") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "EventGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
