import  { Schema, model, Document, Types } from "mongoose";


export interface MessageType extends Document {
    sender:Types.ObjectId,
    text: string,
    chat:Types.ObjectId,
    seenby:Types.ObjectId[],
    unread:Types.ObjectId[],
}

const messageSchema = new Schema<MessageType>({
    sender:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type: String,
        trim: true,
        required: true,
    },
    chat:{
        type: Schema.Types.ObjectId,
        ref:"Chat",
        required: true,
        index:true,
    },
    seenby: [{
        type: Schema.Types.ObjectId,
        ref:"User"
    }],

}, { timestamps: true })

messageSchema.index({chat: 1, createdAt: 1});

export const Message = model<MessageType>("messages", messageSchema);