import express from 'express';
import dotenv from 'dotenv'
import { createServer } from 'node:http';
import { Server } from 'socket.io'
import cors from 'cors';
import connectDB from './config/db.js';
import helmet from 'helmet';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js'

dotenv.config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 2100;

//mongodb connection
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("a user connected: ",socket.id);
    socket.on('receive-message', (msg)=> {
        console.log('message: ' +msg);
        io.emit('receive-message', msg);
        
    })
    
})
app.use('/api/auth', userRouter);

app.use(errorMiddleware);
server.listen(port, () =>{
    console.log(`Server is listening on the port ${port}`)
})