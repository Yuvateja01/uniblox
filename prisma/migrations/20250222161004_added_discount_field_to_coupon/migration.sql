/*
  Warnings:

  - Added the required column `discountPercentage` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "discountPercentage" INTEGER NOT NULL;
