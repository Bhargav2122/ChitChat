import type { Server, Socket } from "socket.io"
import { Message } from "../models/messageSchema.js";
import { Chat } from "../models/chatModel.js";


export const registerChatEvents = (io: Server, socket: Socket) => {
    socket.on("join-chat", (chatId: string) => {
        socket.join(`chat:${chatId}`);
    });

    socket.on("chat-leave", (chatId: string) => {
        socket.leave(`chat:${chatId}`);
    });
}

export const registerMessageEvents = (io: Server, socket: Socket) => {
    socket.on("send-message", async( payload: {chatId: string, text: string}, ack: (data: any) => void) => {
        try {
            const message = await Message.create({ sender: socket.userId, text: payload.text, chatId: payload.chatId, seenby:[socket.userId]});
            await Chat.findByIdAndUpdate(payload.chatId, { latestMessage: message._id});
            const fullMessage = await Message.findById(message._id).populate("sender", "name email").populate("chatId");

            //emit to chat room
            io.to(`chat:${payload.chatId}`).emit("new-message", fullMessage);

            ack({ success: true, message: fullMessage});
        } catch(error: any){
            ack({ success: false, error: "Message failed"});
        }
    });


    socket.on("message-seen", async(chatId: string) => {
        await Message.updateMany(
            {
                chatId,
                seenby: { $ne: socket.userId},
            },
            {
                $push: { seenby: socket.userId},
            }
        );

        io.to(`chat:${chatId}`).emit("message-seen", { chatId, userId: socket.userId});
    });

    socket.on("typing", (chatId: string) => {
        socket.to(`chat:${chatId}`).emit("typing", { chatId, userId: socket.userId});
    });

    socket.on("stop-typing", (chatId: string) => {
        socket.to(`chat:${chatId}`).emit("stop-typing", { chatId, userId: socket.userId});
    });
}