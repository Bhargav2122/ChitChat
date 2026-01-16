import { Schema, model, Document, Types } from 'mongoose';

export interface ChatType extends Document{
    chatName?: string;
    users: Types.ObjectId[];
    isGroup: boolean;
    directKey?:string;
    latestMessage?:Types.ObjectId;
}

const chatSchema = new Schema<ChatType>({
    
    users:{ 
        type: [{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }],
        validate: {
            validator: (v: Types.ObjectId[]) => v.length >=2,
            message: "Chat must have atleast 2 users",
        }
     },
    isGroup:{
        type:Boolean,
        default:false,
    },
    chatName: {
        type: String,
        trim: true,
    },
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message",
    },
    directKey: {
        type:String,
        unique: true,
        sparse: true,
        default: undefined,
    }
}, { timestamps: true });
chatSchema.pre("validate", function () {
    if (this.users.length > 2) {
        this.isGroup = true;

        if (!this.chatName) {
            return new Error("Group chat requires chatName");
        }
      
        delete this.directKey 
    } else {
        this.isGroup = false;
        delete this.chatName;

        // prevent duplicate 1:1 chats
        this.directKey = this.users
            .map(id => id.toString())
            .sort()
            .join("_");
    }
});

chatSchema.index({ directKey: 1 }, { unique: true, sparse: true });
chatSchema.index({ updatedAt: -1 });
export const Chat = model<ChatType>("chats", chatSchema);
