import { JwtPayload } from "../utils/generateToken.js";
import asyncHandler from 'express-async-handler'
import ApiError from "../utils/ApiError.js";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { Socket } from "socket.io";
import { parse } from "cookie";

export const verifyToken = (socket: Socket, next:NextFunction) => {
    try{
        const cookieHeader = socket.handshake.headers.cookie;
        if(!cookieHeader) {
            return next(new ApiError(401, "Authentication required") )
        }
        const cookies = parse(cookieHeader);
        const token = cookies.token;
        if(!token) {
            return next(new ApiError(401, "Token missing or invalid"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
        socket.data.user = decoded;
        next();
    } catch {
        next (new ApiError(401, "Invalid Token or Expired"))
    }
};