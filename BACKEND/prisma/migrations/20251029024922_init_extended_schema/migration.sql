/*
  Warnings:

  - Changed the type of `purpose` on the `VerificationCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "VerificationCode" DROP COLUMN "purpose",
ADD COLUMN     "purpose" TEXT NOT NULL;
