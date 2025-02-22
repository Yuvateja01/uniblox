/*
  Warnings:

  - You are about to drop the `CartCouponMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartCouponMap" DROP CONSTRAINT "CartCouponMap_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartCouponMap" DROP CONSTRAINT "CartCouponMap_couponId_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "couponId" INTEGER;

-- DropTable
DROP TABLE "CartCouponMap";

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
