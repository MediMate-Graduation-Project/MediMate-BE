/*
  Warnings:

  - Made the column `status` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "status" SET NOT NULL;
