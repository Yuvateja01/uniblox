/*
  Warnings:

  - Added the required column `quantity` to the `CartProductMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartCouponMap" DROP CONSTRAINT "CartCouponMap_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartCouponMap" DROP CONSTRAINT "CartCouponMap_couponId_fkey";

-- DropForeignKey
ALTER TABLE "CartProductMap" DROP CONSTRAINT "CartProductMap_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartProductMap" DROP CONSTRAINT "CartProductMap_productId_fkey";

-- AlterTable
ALTER TABLE "CartProductMap" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "price" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductMap" ADD CONSTRAINT "CartProductMap_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductMap" ADD CONSTRAINT "CartProductMap_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartCouponMap" ADD CONSTRAINT "CartCouponMap_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartCouponMap" ADD CONSTRAINT "CartCouponMap_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
