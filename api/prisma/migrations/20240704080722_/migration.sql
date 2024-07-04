/*
  Warnings:

  - You are about to drop the column `emailVerifyToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailVerifiyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerifyToken",
ADD COLUMN     "emailVerifiyToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerifiyToken_key" ON "User"("emailVerifiyToken");
