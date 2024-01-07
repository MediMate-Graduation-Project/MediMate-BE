/*
  Warnings:

  - Added the required column `date` to the `Appoiments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Appoiments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated` to the `Appoiments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hopitalId` to the `Appoiments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `Appoiments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Appoiments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Appoiments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Diagnostics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeofdisease` to the `Diagnostics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Diagnostics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `HealthInsurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `HealthInsurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `HealthInsurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `HealthInsurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalType` to the `Hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industryCode` to the `Hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specializationId` to the `Hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalId` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_review` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalId` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinic` to the `Specializations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Specializations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomNumber` to the `Specializations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appoiments" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estimated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hopitalId" INTEGER NOT NULL,
ADD COLUMN     "orderNumber" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Diagnostics" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "typeofdisease" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "HealthInsurances" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Hospitals" ADD COLUMN     "hospitalType" TEXT NOT NULL,
ADD COLUMN     "industryCode" INTEGER NOT NULL,
ADD COLUMN     "specializationId" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hospitalId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "date_review" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hospitalId" INTEGER NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "review" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Specializations" ADD COLUMN     "clinic" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "roomNumber" TEXT NOT NULL;
