/*
  Warnings:

  - The primary key for the `addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `addresses` table. All the data in the column will be lost.
  - The `addressId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[street,zipCode,area]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_addressId_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "addressId",
ADD COLUMN     "addressId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "addresses_street_zipCode_area_key" ON "addresses"("street", "zipCode", "area");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
