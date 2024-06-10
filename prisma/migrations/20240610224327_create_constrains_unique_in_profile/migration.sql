/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "profiles_userName_key" ON "profiles"("userName");
