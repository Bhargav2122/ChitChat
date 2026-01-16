import  type { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { registerSchema, loginSchema } from "../utils/authValidation.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from 'express-async-handler';
import { generateToken } from "../utils/generateToken.js";



export const register = asyncHandler(async( req: Request, res: Response ) => {
     const parsedBody = req.body;
     const result = registerSchema.safeParse(parsedBody);
     if(!result.success) {
        throw new ApiError(400, "Please enter valid Inputs");
     }

     const {name, email, password } = result.data;

     if(!name || !email || !password) {
        throw new ApiError(400,"Required all feilds");
     }
    const isExist = await User.findOne({ email });
    if(isExist) {
        throw new ApiError(409,"Email already exists");
    }

    const user = await User.create({ name, email, password });
    const token = await generateToken({id: user._id.toString(), email:user.email});
    res.cookie('token', token, { httpOnly:true, sameSite:"lax", secure:false});
    res.json({
        id:user._id,
        name: user.name,
        email:user.email,
        profilePic: user.profilePic
    });
});


export const login = asyncHandler(async(req: Request, res: Response) => {
    const parsedBody = req.body;
    const result = loginSchema.safeParse(parsedBody);
    if(!result.success){
        throw new ApiError(400, "Please enter valid Inputs")
    }
    const { email, password } = result.data;
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.isValidPassword(password))){
        throw new ApiError(401, "Incorrect email or password");
    }
    const token = await generateToken({id: user._id.toString(), email:user.email});
    res.cookie('token', token, { httpOnly:true, sameSite:"lax", secure:false});
    res.json({
        id:user._id,
        name:user.name,
        email: user.email,
        profilePic: user.profilePic,
        isOnline: user.isOnline,
        lastseen: user.lastSeen,
        bio: user.bio,
    });

});

export const logout = async(req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ success: true, message: "Logged out successfully"});
}
