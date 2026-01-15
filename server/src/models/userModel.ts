import bcrypt, { compare } from 'bcryptjs';
import {Document, Schema, model } from 'mongoose';

export interface UserType extends Document{
    name:string,
    email:string,
    bio:string,
    password: string,
    profilePic: string,
    isOnline: boolean,
    lastSeen:Date,
    isValidPassword(password: string): Promise<boolean>
}


const userSchema = new Schema<UserType>({
    name: {
        type:String,
        trim:true,
        required:true,
    },
    email: {
        type:String,
        lowercase:true,
        required:true,
        unique:true,
    },
    bio: {
        type: String,
        default:""
    },
    password: {
        type:String,
        required: true,
    },
    profilePic:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIwRBD9gNuA2GjcOf6mpL-WuBhJADTWC3QVQ&s"
    },
    isOnline: {
        type:Boolean,
        default: false,
    },
    lastSeen: {
        type:Date,
        default: Date.now,
    },
}, { timestamps: true});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    
});

userSchema.methods.isValidPassword = async function(password: string): Promise<boolean> {  
    return compare(password, this.password);
}

export const User = model<UserType>('users', userSchema);