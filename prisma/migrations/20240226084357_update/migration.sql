/*
  Warnings:

  - You are about to drop the column `reviewsId` on the `Hospitals` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hospitals" DROP CONSTRAINT "Hospitals_reviewsId_fkey";

-- AlterTable
ALTER TABLE "Hospitals" DROP COLUMN "reviewsId";

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
