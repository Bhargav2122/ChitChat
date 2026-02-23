import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import type { Request, Response } from "express";
import { log } from "node:console";

export const changeProfile = asyncHandler(async(req: Request, res: Response) => {
    const { bio } = req.body;
    
    if(!bio || bio.trim() === '') {
        throw new ApiError(400, "Bio cannot be empty");
    }
    const user = await User.findByIdAndUpdate(req.user.id, { bio: bio.trim()}).select("_id name email bio");
    if(!user) {
        throw new ApiError(404, "User not found");
    }
 
    res.status(200).json({
        message: "Bio updated Successfully",
        user
    });
});

export const searchUsers = asyncHandler(async(req: Request, res: Response) => {
    const keyword = req.query.search as string;
    const currentUserId = req.user.id;
    console.log("loggedin:", req.user.id);
    console.log("Search query: ", req.query.search)

    if(!keyword) {
        res.json([]);
        return;
    }

    const users = await User.find({
        _id:{ $ne: currentUserId},
        $or: [
            { name: { $regex: keyword, $options: "i"}},
            { email : { $regex: keyword, $options: "i"}}
        ]
    }).select("_id name email profilePic");
    res.json(users);
})


