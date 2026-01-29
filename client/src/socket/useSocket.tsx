import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks"
import socketService from './Socket';
import type { Message } from "../types/ChatTypes";
import { addMessage, removeTyping, setTyping, updateMessageSeen } from "../features/messages/messageSlice";
import { updateLatestMessage } from "../features/chat/chatSlice";

export const useSocket = () => {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const socket = socketService.connect();

        socket.on('new-message', (message: Message) => {
            dispatch(addMessage(message));
            dispatch(updateLatestMessage({
                chatId: typeof message.chatId === 'string' ? message.chatId : message._id, message
            }));
        });
        
        socket.on('typing', ({ chatId, userId }: {chatId: string; userId: string}) => {
            dispatch(setTyping({ chatId, userId}));
        })

        socket.on('stop-typing', ({chatId, userId}: { chatId: string, userId: string}) => {
            dispatch(removeTyping({ chatId, userId}))
        })
        socket.on('message-seen', ({ chatId, userId}: { chatId: string; userId: string})=> {
            dispatch(updateMessageSeen({ chatId, userId }))
        })
        socket.on('user-offline', ({ userId } : {userId: string}) => {
            console.log('User Online: ', userId);
        })
        socket.on('user-offline', ({ userId}: {userId: string}) => {
            console.log('User offline: ', userId)
        })

        return () => {
            socketService.disconnect();
        }
    }, [dispatch]);
    
    return socketService;
}