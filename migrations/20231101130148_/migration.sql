/*
  Warnings:

  - You are about to drop the `RelatedObject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RelatedObject" DROP CONSTRAINT "RelatedObject_userId_fkey";

-- DropTable
DROP TABLE "RelatedObject";
