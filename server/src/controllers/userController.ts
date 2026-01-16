import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/userModel.js";


export const changeProfile = asyncHandler(async(req, res) => {
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

