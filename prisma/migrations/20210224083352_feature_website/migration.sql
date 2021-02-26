-- AlterTable
ALTER TABLE "Feature" ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "aboutPage" TEXT;

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "value" TEXT,

    PRIMARY KEY ("id")
);
