/*
  Warnings:

  - Changed the type of `minCartValue` on the `Coupon` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `minOrders` on the `Coupon` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "minCartValue",
ADD COLUMN     "minCartValue" INTEGER NOT NULL,
DROP COLUMN "minOrders",
ADD COLUMN     "minOrders" INTEGER NOT NULL;
