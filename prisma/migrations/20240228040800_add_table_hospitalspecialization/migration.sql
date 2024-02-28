/*
  Warnings:

  - You are about to drop the column `specializationId` on the `Hospitals` table. All the data in the column will be lost.
  - Added the required column `address` to the `Hospitals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Hospitals" DROP CONSTRAINT "Hospitals_specializationId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_userId_fkey";

-- AlterTable
ALTER TABLE "Hospitals" DROP COLUMN "specializationId",
ADD COLUMN     "address" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "HospitalSpecialization" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "specializationId" INTEGER NOT NULL,

    CONSTRAINT "HospitalSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReviewsToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HospitalSpecialization_hospitalId_specializationId_key" ON "HospitalSpecialization"("hospitalId", "specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "_ReviewsToUsers_AB_unique" ON "_ReviewsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ReviewsToUsers_B_index" ON "_ReviewsToUsers"("B");

-- AddForeignKey
ALTER TABLE "HospitalSpecialization" ADD CONSTRAINT "HospitalSpecialization_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalSpecialization" ADD CONSTRAINT "HospitalSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specializations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewsToUsers" ADD CONSTRAINT "_ReviewsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewsToUsers" ADD CONSTRAINT "_ReviewsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
