/*
  Warnings:

  - The `todoOrder` column on the `Calendar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `todoOrder` column on the `List` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `listOrder` column on the `ListCollection` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Calendar" DROP COLUMN "todoOrder",
ADD COLUMN     "todoOrder" INTEGER[];

-- AlterTable
ALTER TABLE "List" DROP COLUMN "todoOrder",
ADD COLUMN     "todoOrder" INTEGER[];

-- AlterTable
ALTER TABLE "ListCollection" DROP COLUMN "listOrder",
ADD COLUMN     "listOrder" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
