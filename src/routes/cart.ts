import {Request,Response,Router} from "express"
import { PrismaClient } from "@prisma/client"
import { cartSchema } from "../validators/cart";

const cartRouter = Router();
const prisma = new PrismaClient();



async function getCartProducts(cartid:number){

    try{
        const products = await prisma.cartProductMap.findMany({
            where:{
                cartId:cartid
            }
        })
        return products
    }
    catch(error){
        console.log(`Error Occured ${error}`)
    }
}


async function addProduct(cartid:number,productid:number,quantity:number,price:number){

    //update all the operations to transactions
    try{
        const product = await prisma.cartProductMap.findFirst({
            where:{
                cartId:cartid,
                productId:productid
            }
        })

        if (product){
            const updateProduct = await prisma.cartProductMap.update({
                where:{
                    id:product.id,
                    cartId:cartid,
                    productId:productid
                },
                data:{
                    quantity:quantity
                }
            })
            const priceUpdated = await updateCartPrice(cartid,productid,product.quantity,quantity,price)
        }
        else{
            const createCartProduct = await prisma.cartProductMap.create({
                data:{
                    cartId:cartid,
                    productId:productid,
                    quantity:quantity
                }
            })

            const priceUpdated = await updateCartPrice(cartid,productid,0,quantity,price)
        }
        
        return true
    }
    catch(error){
        console.log(`Error Occured ${error}`)
        return false
    }
}

async function deleteProduct(cartid:number,productid:number,cartprice:number){

    //update all the operations to transactions
    try{
        const product = await prisma.cartProductMap.findFirst({
            where:{
                cartId:cartid,
                productId:productid
            }
        })
        if (product){
            const updateProduct = await prisma.cartProductMap.delete({
                where:{
                    id:product.id,
                    cartId:cartid,
                    productId:productid
                }
            })
            const priceUpdated = await updateCartPrice(cartid,productid,product?.quantity,0,cartprice)
        }


        return true
    }
    catch(error){
        console.log(`Error Occured ${error}`)
        return false
    }
}


async function updateCartPrice(cartid:number,productid:number,quantity:number,updatedQuantity:number,cartPrice:number){

    try{
    const product = await prisma.product.findFirst({
        where:{
            id:productid
        }
    })
    let change:number = 0
    if(product){
        change= (updatedQuantity - quantity)*product?.price
    }

    const cart = await prisma.cart.update({
        where:{
            id:cartid
        },
        data:{
            price:cartPrice+change
        }
    })
    return true
    }
    catch(error){
        console.log(`error occured ${error}`)
        return false
    }
}

cartRouter .post("/add",async(req:Request,res:Response)=>{
    const product = req.body

    if(!cartSchema.addProductSchema.safeParse(product).success){
        res.status(400).json({"errorMessage":"Improper request body sent"})
        return;
    }

    try{
    const cart= await prisma.cart.findFirst({
        where:{
            userId:res.locals.userid
        }
    })
    if (cart){
        const isUpdated = await addProduct(cart.id,product.productId,product.quantity,cart.price);
        if (isUpdated){
            res.status(201).json({"success":"Added/Updated Product"})
            return;
        }
        else{
            res.status(500).send({"error":"Unable to update Product"})
            return;
        }

    }
    else{
        res.status(500).send({"errorMessage":"Unable to update Product"})
        return;
    }
    
    }
    catch(error){
        console.log(`error occured ${error}`)
        res.status(500).send({"errorMessage":"Internal Server Error"})
        return;
    }
})


cartRouter .get("",async(req:Request,res:Response)=>{
    try{
        const cart= await prisma.cart.findFirst({
            where:{
                userId:res.locals.userid
            }
        })
        if (cart){
        const products = await getCartProducts(cart.id)
        res.status(200).json({cart,products})
        return;
        }
        else{
            res.status(500).json({"errorMessage":"Error Occured"})
            return;
        }
    }
    catch(error){
        console.log(`error occured ${error}`)
        res.status(500).json({"errorMessage":"Internal Error Occured"})
        return;
    } 
})


cartRouter .post("/remove",async(req:Request,res:Response)=>{
    const product = req.body

    if(!cartSchema.removeProductSchema.safeParse(product).success){
        res.status(400).json({"errorMessage":"Improper request body sent"})
        return;
    }

    try{
    const cart= await prisma.cart.findFirst({
        where:{
            userId:res.locals.userid
        }
    })
    if (cart){
        const isDeleted= await deleteProduct(cart.id,product.productId,cart.price);
        if (isDeleted){
            res.status(201).json({"success":"Product Removed from Cart"})
            return;
        }
        else{
            res.status(500).send({"error":"Unable to Remove Product"})
            return;
        }

    }
    else{
        res.status(500).send({"errorMessage":"Unable to update Product"})
        return;
    }
    
    }
    catch(error){
        console.log(`error occured ${error}`)
        res.status(500).send({"errorMessage":"Internal Server Error"})
        return;
    }
})



cartRouter.get("/coupons",async(req:Request,res:Response)=>{

    //Every Nth order can be tweaked
    const NORDERS:number = 5

    try{
    const cart = await prisma.cart.findFirst({
        where:{
            userId:res.locals.userid
        }
    })

    const orderCount = await prisma.order.count({
        where:{
            userId:res.locals.userid,
            status:"DELIVERED"
        }
    })
    if (cart && orderCount && (orderCount+1)%NORDERS == 0){
    const eligibleCoupons = await prisma.coupon.findMany({
        where:{
            minCartValue:{
                lt:cart.price,
            },
            minOrders:{
                lt:orderCount,
            }
        }
    })
    res.status(200).send({"success":eligibleCoupons})
    return;
    }
    else{
        res.status(500).send({"errorMessage":"Unable to get Coupons"})
        return;
    }
}
    catch(error){
        res.status(500).send({"errorMessage":"Unable to get Coupons"})
    }

})

cartRouter.post("/coupons",async(req:Request,res:Response)=>{
    try{
    const couponBody = req.body;
    //Every Nth order can be tweaked
    const NORDERS:number = 5

    if(!cartSchema.applyCoupon.safeParse(couponBody).success){
        res.status(400).json({"errorMessage":"Improper request body sent"})
        return;
    }

    const cart = await prisma.cart.findFirst({
        where:{
            userId:res.locals.userid
        }
    })

    const orderCount = await prisma.order.count({
        where:{
            userId:res.locals.userid,
            status:"DELIVERED"
        }
    })

    const coupon = await prisma.coupon.findFirst({
        where:{
        id:couponBody.couponId
        }
    })

    if (coupon && cart && orderCount && cart.price>coupon.minCartValue && orderCount>coupon.minOrders && (orderCount+1)%NORDERS == 0){
        const multiplier = coupon.discountPercentage/100
        const discount = cart.price*multiplier

        //create coupon association to user via Table
        const cartUpdate = await prisma.cart.update({
            where:{
                id:cart.id
            },
            data:{
                couponId:coupon.id,
                price:cart.price-discount
            }
        })

        res.status(200).send("Coupon applied successfully")
        return;

        //update cart pricing

    }
    }
    catch{
        res.status(500).send({"errorMessage":"Unable to get Coupons"})
    }
})

export default cartRouter;
