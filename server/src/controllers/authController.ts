import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import ApiError from "../utils/ApiError.js";
import { registerSchema, loginSchema, googleAuthSchema } from "../utils/authValidation.js";
