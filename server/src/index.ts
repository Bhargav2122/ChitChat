import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import http, {Server as HttpServer} from 'node:http'
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { initSocket } from './sockets/index.js';
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoute.js'



dotenv.config();

const port = process.env.PORT || 2100;
const app = express();
const server = http.createServer(app);


initSocket(server);



app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.use(cookieParser());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(errorMiddleware);
app.get('/', (req: Request,res: Response) => {
        res.send('hello')
})
server.listen(port, () =>{
    console.log(`Server is listening on: ${port}`)
})