/*
  Warnings:

  - You are about to drop the column `password` on the `passenger` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `passenger` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Passenger_username_key` ON `passenger`;

-- AlterTable
ALTER TABLE `passenger` DROP COLUMN `password`,
    DROP COLUMN `username`;
