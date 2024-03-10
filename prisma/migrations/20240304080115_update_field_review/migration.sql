/*
  Warnings:

  - You are about to drop the `_ReviewsToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ReviewsToUsers" DROP CONSTRAINT "_ReviewsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReviewsToUsers" DROP CONSTRAINT "_ReviewsToUsers_B_fkey";

-- DropTable
DROP TABLE "_ReviewsToUsers";

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
