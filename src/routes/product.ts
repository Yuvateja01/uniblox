import { Router,Request,Response,NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createProductSchema } from "../validators/product";
import authMiddleWare from "../middlewares/auth";

const productRouter = Router();
const prisma = new PrismaClient();



//needs a superuser to check ideally a admin only configuration
productRouter.post("",async(req:Request,res:Response)=>{
    const productObj = req.body

    if(!createProductSchema.safeParse(productObj)){
        res.status(400).json({"errorMessage":"Improper request body used"})
    }

    const product = await prisma.product.create({
        data:{
            "name":productObj.name,
            "image":productObj.image,
            "description":productObj.description,
            "price":productObj.price
        }
    })

    res.status(201).json({"success":"product added successfully"})
})


//paginate this api later use prisma
productRouter.get("",async(req:Request,res:Response)=>{
    const products = await prisma.product.findMany()
    res.status(200).json(products)
})

export default productRouter;

