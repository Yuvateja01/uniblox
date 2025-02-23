//@ts-check

import express from "express";
import { Request,Response,NextFunction } from "express";
import dotenv from "dotenv"
import userRouter from "./routes/user"
import authMiddleWare from "./middlewares/auth";
import customRateLimiter from "./middlewares/ratelimiter";
import productRouter from "./routes/product";
import cartRouter from "./routes/cart";

if (process.env.NODE_ENV == 'test') {
    dotenv.config({ path: '.env.test' });
  } else {
    dotenv.config({ path: '.env' });
  }


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user",userRouter)

//auth middleware
app.use(authMiddleWare)
//ratelimiter middleware
app.use(customRateLimiter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)

app.get("/test",(req:Request,res:Response)=>{
    res.send("Test Endpoint")
})


export default app

