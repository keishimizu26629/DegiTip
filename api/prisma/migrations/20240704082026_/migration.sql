/*
  Warnings:

  - You are about to drop the column `emailVerifiyToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailVerifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_emailVerifiyToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerifiyToken",
ADD COLUMN     "emailVerifyToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerifyToken_key" ON "User"("emailVerifyToken");
