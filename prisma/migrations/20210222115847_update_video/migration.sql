/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Poster` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Video` table. All the data in the column will be lost.
  - Added the required column `url` to the `Poster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Poster" DROP COLUMN "imageUrl",
ADD COLUMN     "title" TEXT,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "url",
ADD COLUMN     "title" TEXT,
ADD COLUMN     "videoId" TEXT NOT NULL;
