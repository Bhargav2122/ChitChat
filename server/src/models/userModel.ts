import { HydratedDocument, Schema, model } from "mongoose";
import { userType } from "../types/userType.js";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";

const userSchema = new Schema<userType>({
    fullname:{
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type:String,
    },
    avatar: {
        type: String,
        default:"https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png",
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    authProviders: {
        local:{
            type: Boolean, 
            default: false,
        },
        google:{
            type: Boolean,
            default: false,
        },
    },
    lastSeen:{
        type:Date,
        default: Date.now,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true});

userSchema.pre('save', async function( this: HydratedDocument<userType>) {
  if(!this.isModified("password") || !this.password) {
    return;
  }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
});

const User = model<userType>('users', userSchema);

export default User;