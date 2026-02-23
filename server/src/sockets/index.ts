import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import type { JwtPayload } from "../utils/generateToken.js";
import ApiError from "../utils/ApiError.js";
import type { Http2SecureServer } from "node:http2";
import { registerChatEvents, registerMessageEvents } from "./registerHandler.js";
import { addOnlineUsers, isUserOnline, removeOnlineUser } from "./onlinerUsers.js";
import { Server as HttpServer } from 'http'
import { User } from "../models/userModel.js";
import cookie from 'cookie';

export const initSocket = (server: HttpServer) => {
    const io = new Server(server, { cors: { origin: "http://localhost:5173", credentials: true}});

    io.use((socket,next) => {
        const rawCookie = socket.handshake.headers.cookie;
        if(!rawCookie) {
           return next(new Error("No cookies sent"));
        }
        const cookies = cookie.parse(rawCookie);
        const token = cookies.token;
        if(!token) {
            return new ApiError(401, "UnAuthorized");
        }
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
         socket.userId = decoded.id;
         next();
        } catch(err: any){
            return next(new Error("Invalid token"));
        }
         
    });

    io.on("connection", async (socket) => {
       
        const userId = socket.userId;
         console.log("Connected user", socket.userId)

        addOnlineUsers(userId, socket.id);
        socket.join(socket.userId);

        await User.findByIdAndUpdate(userId, { isOnline: true})

        io.emit("user-online", {userId});
        socket.on("disconnect", async () => {
            removeOnlineUser(userId, socket.id);
            
            if(!isUserOnline(userId)) {
                await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date()})
                io.emit("user-offline", { userId });
            }
        });
        
        
        registerChatEvents(io, socket);
        registerMessageEvents(io, socket);
    })
}