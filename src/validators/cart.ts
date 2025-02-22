import {z} from "zod";

const addProductSchema = z.object({
    productId:z.number(),
    quantity:z.number()
})

const removeProductSchema = z.object({
    productId:z.number()
})

const applyCoupon = z.object({
    couponId:z.number()
})

export const cartSchema ={
    addProductSchema,removeProductSchema,applyCoupon
}