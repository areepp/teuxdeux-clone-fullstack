-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "calendarId" TEXT,
ADD COLUMN     "listId" INTEGER,
ALTER COLUMN "checked" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "todoOrder" TEXT[],

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "todoOrder" TEXT[],
    "listCollectionId" INTEGER,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListCollection" (
    "id" SERIAL NOT NULL,
    "listOrder" TEXT[],

    CONSTRAINT "ListCollection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_listCollectionId_fkey" FOREIGN KEY ("listCollectionId") REFERENCES "ListCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
