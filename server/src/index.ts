import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import http from 'node:http'
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
dotenv.config();

const port = process.env.PORT || 2100;
const app = express();
const server = http.createServer(app);
const io = new Server(server);




app.use(cors({
    origin:"*",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);


app.use(errorMiddleware);
app.get('/', (req: Request,res: Response) => {
        res.send('hello')
})
server.listen(port, () =>{
    console.log(`Server is listening on: ${port}`)
})