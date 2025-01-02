/*
  Warnings:

  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status",
ADD COLUMN     "isPresent" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "AttendanceStatus";
