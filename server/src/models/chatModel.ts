import { Schema, model, Document, Types } from "mongoose";
import { User } from "./userModel.js";
import {Message} from './messageSchema.js';

export interface ChatType extends Document {
  chatName?: string;
  users: Types.ObjectId[];
  isGroup: boolean;
  latestMessage?: Types.ObjectId;
}

const chatSchema = new Schema<ChatType>(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },
    users: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
    },
    chatName: {
      type: String,
      trim: true,
    },
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

chatSchema.index({ updatedAt: -1 });
export const Chat = model<ChatType>("Chat", chatSchema);
