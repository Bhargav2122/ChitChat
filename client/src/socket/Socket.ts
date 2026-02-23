import { io } from 'socket.io-client';

export const socket = io('http://localhost:2100', {
    withCredentials: true,
    autoConnect: false,
})