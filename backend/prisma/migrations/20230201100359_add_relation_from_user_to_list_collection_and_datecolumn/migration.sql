/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ListCollection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ListCollection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DateColumn" ADD COLUMN     "userId" TEXT;

-- AlterTable
CREATE SEQUENCE listcollection_id_seq;
ALTER TABLE "ListCollection" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('listcollection_id_seq');
ALTER SEQUENCE listcollection_id_seq OWNED BY "ListCollection"."id";

-- CreateIndex
CREATE UNIQUE INDEX "ListCollection_userId_key" ON "ListCollection"("userId");

-- AddForeignKey
ALTER TABLE "DateColumn" ADD CONSTRAINT "DateColumn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListCollection" ADD CONSTRAINT "ListCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
