import { Router,Request,Response,NextFunction } from "express";
import { userValidator } from "../validators/user";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken"

const userRouter = Router();
const prisma = new PrismaClient();

userRouter.post("/signup",async (req:Request,res:Response)=>{
    const userObj = req.body

    if(!userValidator.createUserSchema.safeParse(userObj).success){
        res.status(404).json({"errorMessage":"Improper request body sent"})
        return;
    }
    try{

        const saltRounds:number = 10
        const plainPassword = userObj.password
        const hash = bcrypt.hashSync(plainPassword,saltRounds);
        const user = await prisma.user.create({
            data:{
                "username":userObj.username,
                "email":userObj.email,
                "password":hash,
                "superuser":false
            }
        })

        //create a cart for user
        const cart = await prisma.cart.create({
            data:{
                userId:user.id
            }
        })
        res.status(201).json({"success":"User Created Successfully"})
        return;
    }
    catch{
        res.status(500).json({"errorMessage":"Internal Server Error/Try Again"})
        return;
    }
})


userRouter.post("/signin",async (req:Request,res:Response)=>{
    const userObj = req.body

    if(!userValidator.loginUserSchema.safeParse(userObj).success){
        res.status(404).json({"errorMessage":"Improper request body sent"})
        return;
    }
    try{
        const user = await prisma.user.findUnique({
            where:{
                "email":userObj.email
            }
        })
        if (!user){
            res.status(401).json({"errorMessage":"Incorrect email/password"})
            return;
        }
        else{
            if (!bcrypt.compareSync(userObj.password, user.password)){
                res.status(401).json({"errorMessage":"Incorrect username/password"})
                return
            }
            const refreshToken = jwt.sign({userid: user.id}, process.env.JWT_SECRET_KEY!, { expiresIn: '24h' });
            const accessToken = jwt.sign({userid: user.id}, process.env.JWT_SECRET_KEY!, { expiresIn: '24h' });
            res.status(200).json({"refreshToken":refreshToken,"accessToken":accessToken})
            return;
        }
        
    }
    catch{
        res.status(500).json({"errorMessage":"Internal Server Error/Try Again"})
        return;
    }
})


userRouter.post("/refresh",async (req:Request,res:Response)=>{


    const token = req.body

    if(!userValidator.tokenSchema.safeParse(token).success){
        res.status(404).json({"errorMessage":"Improper request body sent"})
        return;

    }

    try{
        const isValid= jwt.verify(token.refreshToken,process.env.JWT_SECRET_KEY!) as JwtPayload
        if (!isValid)
            res.status(401).json({"errorMessage":"Invalid Refresh Token"})
        const accessToken = jwt.sign({userid: isValid.userid}, process.env.JWT_SECRET_KEY!, { expiresIn: '24h' });
        res.status(200).json({"accessToken":accessToken})
        return;
    }
    catch{
        res.status(500).json({"errorMessage":"Internal Server Error/Try Again"})
    }


})


export default userRouter;