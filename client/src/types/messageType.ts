import type { User } from "./userType";

export interface MessageType {
    _id:string,
    sender: User,
    text: string,
    chatId:string,
    seenby: string[],
    createdAt: string,
    updatedAt: string,
}