import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import type { Request,Response } from "express";
import { Message } from "../models/messageSchema.js";
import { Chat } from "../models/chatModel.js";


export const sendMessage = asyncHandler(async(req: Request, res: Response) => {
    const {chatId, text } = req.body;
    const senderId = req.user.id;

    if(!chatId || !text) {
        throw new ApiError(400, "Invalid data");
    }
    const message = await Message.create({
        sender: senderId,
        text,
        chatId,
        seenby: [senderId],
    });

     await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id});
     const fullMessage = await Message.findById(message._id).populate("sender", "name email").populate("chatId");
     res.status(200).json(fullMessage);
});

export const getMessages = asyncHandler(async(req: Request, res: Response) => {
    const { chatId } = req.params;
    if(!chatId){
        throw new ApiError(400, "chatid required");
    }

    const messages = await Message.find({ chatId }).populate("sender", "name email");
    res.json(messages);
});


