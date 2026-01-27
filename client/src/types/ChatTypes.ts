import type { User } from "./authType";

export interface Message{
    _id: string,
    sender: User,
    text: string,
    chatId: string,
    seenby: string[],
    createdAt: string,
    updatedAt: string,
}

export interface Chat {
    _id: string,
    chatName?:string,
    users: User[],
    isGroup: boolean,
    latestMessage?:Message,
    createdAt: string,
    updatedAt: string,
}

export interface ChatState{
    chats: Chat[],
    selectedChat: Chat | null,
    loading: boolean,
    error: string | null,
}

export interface MessageState{
    messages: Message[],
    loading: boolean,
    error: string | null,
    typing: {
        [chatId: string]: string[];
    };
}
