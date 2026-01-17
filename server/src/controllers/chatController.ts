import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import { Chat } from "../models/chatModel.js";
import type { Request, Response } from "express";


/* Create or get Chat */
export const accessChat = asyncHandler( async(req: Request,res:Response) => {
     const { userId } = req.body;
     const currentUserId = req.user.id;

     if(!userId) {
        throw new ApiError(400, "UserId required");
     }

     let chat = await Chat.findOne({ isGroup: false, users: { $all: [currentUserId, userId]}}).populate('users','-password').populate('latestMessage');
     if(chat){
         res.status(200).json(chat);
         return;
     }
     chat = (await Chat.create({ isGroup: false, users: [currentUserId, userId]}));
     
     const fullChat = await Chat.findById(chat._id).populate('users', '-password');
     res.status(201).json(fullChat);
})


/* Chat Sidebar or inbox  */
export const getMyChats = asyncHandler(async(req: Request, res: Response) => {
    const userId = req.user.id;
    const chats = await Chat.find({ users: userId}).populate("users", "-password").populate("latestMessage").sort({updatedAt: -1});
    res.json(chats);

})

/* create group chat */

export const createGroupChat = asyncHandler(async( req: Request, res: Response) => {
    const { users, chatName } = req.body;
    if(!users || users.length < 2) {
        throw new ApiError(400,"Atleast 3 users required ");
    }
    users.push(req.user.id);
    const groupChat = await Chat.create({
        chatName,
        isGroup: true,
        users,
    });
    const fullChat = await Chat.findOne(groupChat._id).populate("users", "-password");
    res.status(200).json(fullChat);
});

export const getFriendsList = asyncHandler(async(req: Request, res: Response) => {
    const userId = req.user.id;

    const chats = await Chat.find({
        isGroup: false,
        users:userId,
    }).populate("users", "-password");
    
    const friends = chats.map(chat => chat.users.find(u => u._id.toString() !== userId.toString()))
    res.json(friends);
})