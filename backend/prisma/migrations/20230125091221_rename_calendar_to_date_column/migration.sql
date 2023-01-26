/*
  Warnings:

  - You are about to drop the column `calendarId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the `Calendar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_calendarId_fkey";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "calendarId",
ADD COLUMN     "dateColumnId" TEXT;

-- DropTable
DROP TABLE "Calendar";

-- CreateTable
CREATE TABLE "DateColumn" (
    "id" TEXT NOT NULL,
    "todoOrder" INTEGER[],

    CONSTRAINT "DateColumn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_dateColumnId_fkey" FOREIGN KEY ("dateColumnId") REFERENCES "DateColumn"("id") ON DELETE SET NULL ON UPDATE CASCADE;
