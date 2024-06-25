-- AlterTable
ALTER TABLE "User" ALTER COLUMN "memberNumber" SET DATA TYPE TEXT;

-- RenameIndex
ALTER INDEX "User_memberNumber_unique" RENAME TO "User_memberNumber_key";
