import {Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

export const errorMiddleware = (err: Error,req: Request, res: Response, next: NextFunction) => {
     const statusCode = err instanceof ApiError ? err.statusCode : 500;
     const message = err.message || "Internal Server Error";
     res.status(statusCode).json({ success: false, message});
}