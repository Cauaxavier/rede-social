/*
  Warnings:

  - Added the required column `profileId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
