//@ts-check

import express from "express";
import { Request,Response,NextFunction } from "express";
import dotenv from "dotenv"
import userRouter from "./routes/user"
import authMiddleWare from "./middlewares/auth";
import customRateLimiter from "./middlewares/ratelimiter";
import productRouter from "./routes/product";

dotenv.config()
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//auth middleware
app.use("/user",userRouter)
//ratelimiter middleware

app.use(authMiddleWare)
app.use(customRateLimiter)
app.use("/product",productRouter)

app.get("/test",(req:Request,res:Response)=>{
    res.send("Test Endpoint")
})

app.listen(3000,()=>{
    console.log("server running on port 3000")
})
