import type { MessageType } from "./messageType";
import type { User } from "./userType";

export interface ChatType {
    _id:string,
    chatName?:string,
    users:User[],
    isGroup: boolean,
    latestMessage?:MessageType,
    createdAt: string,
    updateAt: string,
}