import asyncHandler from "express-async-handler";
import type { JwtPayload } from "../utils/generateToken.js";
import jwt from 'jsonwebtoken';
import ApiError from "../utils/ApiError.js";


export const verifyToken = asyncHandler(async(req,res, next) => {
    const token = req.cookies?.token;
    if(!token) {
       throw new ApiError(401, "UnAuthorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string,) as JwtPayload;
    req.user = decoded;
    next();
})