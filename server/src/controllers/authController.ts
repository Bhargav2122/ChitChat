import { Request, Response, NextFunction } from "express";
import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import { registerSchema, loginSchema } from "../utils/authValidation.js";
import asynchandler from "express-async-handler";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const register = asynchandler(async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid inputs");
  }

  const { fullname, email, password } = parsed.data;
  const isUser = await User.findOne({ email });
  if (isUser) {
    return next(new ApiError(409, "User with email already exists"));
  }
  const user = await User.create({
    fullname,
    email,
    password,
    
    authProviders: {
      local: true,
      google: false,
    },
  });
  const token = generateToken({ _id: user._id.toString(), email: user.email });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.json({
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar,
  });
});

export const login = asynchandler(async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid inputs");
  }

  const { email, password, avatar } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }

  if (!user.authProviders.local) {
    throw new ApiError(401, "Use google login for this account");
  }
  if(!user.password) {
    throw new Error("Password login not allowed for this account")
  }
  const isPassword = await bcrypt.compare(password, user.password!);

  if (!isPassword) {
    throw new ApiError(401, "Invalid Password");
  }
  const token = generateToken({ _id: user._id.toString(), email: user.email });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.json({
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar,
  });
});

export const logout = asynchandler(async(req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out"})
});
