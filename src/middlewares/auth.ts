import jwt, { JwtPayload } from "jsonwebtoken"
import { Request,Response,NextFunction } from "express"



function authMiddleWare(req:Request,res:Response,next:NextFunction){

    const authHeader = req.headers.authorization

    console.log(authHeader)

    if (!authHeader){
        console.log("auth header not found")
        res.status(401).json({"errorMessage":"Authorization Header Missing"})
        return;
    }

    try{
        console.log("auth header found")
        const token = authHeader?.split(" ")[1]
        const isValid = jwt.verify(token||" ",process.env.JWT_SECRET_KEY!) as JwtPayload
        console.log(isValid)
        if (isValid){
            res.locals.userid = isValid.userid
        }
        console.log("Jumping to ratelimiter")
        next();
    }
    catch{
        res.send(401).json({"errorMessage":"Incorrect/Expired Token"})
    }

}

export default authMiddleWare;

