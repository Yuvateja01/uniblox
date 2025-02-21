import { RateLimiterMemory } from "rate-limiter-flexible";
import { Request,Response,NextFunction } from "express";

const opts = {
    points: 20, // 6 points
    duration: 60, // Per second
};


const rateLimiter = new RateLimiterMemory(opts);

function customRateLimiter(req:Request,res:Response,next:NextFunction){
    console.log(res.locals.userid)
    rateLimiter.consume(res.locals.userid, 1) // consume 2 points
    .then((rateLimiterRes) => {
      // 2 points consumed
      console.log(rateLimiterRes)
      next();
    })
    .catch((rateLimiterRes) => {
      // Not enough points to consume
      res.status(403).json({"errorMessage":"Too many requests sent"})
    }); 

}

export default customRateLimiter;