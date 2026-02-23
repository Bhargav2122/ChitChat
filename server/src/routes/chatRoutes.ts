import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { accessChat, createGroupChat, getFriendsList, getMyChats } from '../controllers/chatController.js';

const router = express.Router();

// create or get direct chat
router.post('/', verifyToken, accessChat);

// get all chats for logged in user
router.get("/", verifyToken, getMyChats);

//creatr group chat
router.post('/group', verifyToken, createGroupChat);

// get friends list(derived from chat)
router.get("/friends", verifyToken, getFriendsList);

export default router;
