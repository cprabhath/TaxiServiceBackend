/*
  Warnings:

  - You are about to drop the column `password` on the `passenger` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `passenger` table. All the data in the column will be lost.
  - You are about to drop the `commision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicledriver` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `PhoneOperator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `PhoneOperator` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Passenger_username_key` ON `passenger`;

-- AlterTable
ALTER TABLE `admin` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NOT NULL DEFAULT 'null',
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `drivers` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/taxiservice-3547e.appspot.com/o/uploads%2F8583437.png?alt=media&token=1ca1802e-a46b-4622-89e1-257e76d71481',
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'driver',
    MODIFY `status` VARCHAR(191) NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `passenger` DROP COLUMN `password`,
    DROP COLUMN `username`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isTemporary` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `operatorId` INTEGER NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/taxiservice-3547e.appspot.com/o/uploads%2F9220769.png?alt=media&token=f5e436ef-dbfd-4c5c-b9ae-998d30d01b42',
    ADD COLUMN `registeredByOperator` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'passenger',
    MODIFY `isEmailVerified` BOOLEAN NULL DEFAULT false,
    MODIFY `status` VARCHAR(191) NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `phoneoperator` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/taxiservice-3547e.appspot.com/o/uploads%2F896334.png?alt=media&token=f330e7b4-ca6e-441d-b4ee-321f956ae06c',
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'phone_operator',
    MODIFY `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `status` VARCHAR(191) NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `ImagePath` VARCHAR(191) NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(191) NULL DEFAULT 'pending';

-- DropTable
DROP TABLE `commision`;

-- DropTable
DROP TABLE `vehicledriver`;

-- CreateTable
CREATE TABLE `Rides` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driverId` INTEGER NULL,
    `vehicleId` INTEGER NULL,
    `passengerId` INTEGER NOT NULL,
    `pickupLocation` VARCHAR(191) NOT NULL,
    `dropLocation` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `distance` VARCHAR(191) NOT NULL,
    `cost` VARCHAR(191) NOT NULL,
    `platformCommission` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleType` VARCHAR(191) NOT NULL,
    `rate` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Rates_vehicleType_key`(`vehicleType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatformRates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rate` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rides` ADD CONSTRAINT `Rides_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Drivers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rides` ADD CONSTRAINT `Rides_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rides` ADD CONSTRAINT `Rides_passengerId_fkey` FOREIGN KEY (`passengerId`) REFERENCES `Passenger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Passenger` ADD CONSTRAINT `Passenger_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `PhoneOperator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
