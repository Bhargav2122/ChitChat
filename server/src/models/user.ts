import { HydratedDocument, Schema, model } from "mongoose";
import { authType } from "../types/authType.js";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";
const userSchema = new Schema<authType>({
    fullname:{
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type:String,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    }
}, { timestamps: true});

userSchema.pre('save', async function( this: HydratedDocument<authType>,next) {

 
  if(!this.isModified("password") || !this.password) {
    return;
  }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if(!this.password) return false;
    return  bcrypt.compare(candidatePassword, this.password);
}


const User = model<authType>('users', userSchema);

export default User;