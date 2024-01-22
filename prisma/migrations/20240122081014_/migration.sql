/*
  Warnings:

  - The `status` column on the `Hospitals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[hospitalName]` on the table `Hospitals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hospitalName` to the `Hospitals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Hospitals" ADD COLUMN     "hospitalName" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "UserStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Hospitals_hospitalName_key" ON "Hospitals"("hospitalName");
