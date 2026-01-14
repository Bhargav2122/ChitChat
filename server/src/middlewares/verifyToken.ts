import { JwtPayload } from "../utils/generateToken.js";
import asyncHandler from 'express-async-handler'
import ApiError from "../utils/ApiError.js";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { Socket } from "socket.io";
import { parse } from "cookie";

export const verifyToken = (socket: Socket, next: (err?:Error) => void) => {
    try{
        const cookieHeader = socket.handshake.headers.cookie;
        if(!cookieHeader) {
            return next(new Error("Token invalid"))
        }
        const cookies = parse(cookieHeader);
        const token = cookies.token;
        if(!token) {
            return next(new Error("Token missing"))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
        socket.data.user = decoded;
        next();
    } catch {
        return next (new Error("Invalid Token or Expired"))
    }
};