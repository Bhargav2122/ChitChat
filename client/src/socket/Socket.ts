import {io, Socket} from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;

    connect():Socket{
        if(!this.socket) {
            this.socket = io('http://localhost:2100', {
                withCredentials:true,
                autoConnect: false,
            });
        }
        if(!this.socket.connected) {
            this.socket.connect();
        }
        return this.socket;
    }

    disconnect(): void {
        if(this.socket) {
            this.socket.disconnect();
            this.socket=null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }
    emit(event: string, data: any): void {
        if(this.socket){
            this.socket.emit(event, data);
        }
    }
    on(event: string, callback:(...args:any[]) => void):void {
        if(this.socket){
            this.socket.on(event, callback);
        }
    }
    off(event: string, callback?:(...args: any[]) => void): void {
        if(this.socket){
            this.socket.off(event, callback);
        }
    }
    joinChat(chatId: string):void {
        this.emit('join-chat', chatId);
    }
    leaveChat(chatId: string): void{
        this.emit('chat-leave', chatId);
    }
    sendMessage (
        payload: {chatId:string, text: string},
        callback:(data: any) => void): void {
            if(this.socket){
                this.socket.emit('send-message', payload, callback);
            }
        }
    markMessageSeen(chatId: string):void {
        this.emit('message-seen', chatId);
    }
    startTyping(chatId: string):void{
        this.emit('typing', chatId);
    }
    stopTyping(chatId: string): void {
        this.emit('stop-typing', chatId);
    }
}

export default new SocketService();