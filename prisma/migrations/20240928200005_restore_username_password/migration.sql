/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Passenger` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Passenger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `passenger` ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Passenger_username_key` ON `Passenger`(`username`);
