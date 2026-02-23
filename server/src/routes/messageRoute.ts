import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js';
import { getMessages, markMessageSeen, sendMessage } from '../controllers/messageController.js';


const router = express.Router();

//send message
router.post('/', verifyToken, sendMessage);

//get all messages of chat
router.get('/:chatId', verifyToken, getMessages);

//mark messages as read
router.put('/seen', verifyToken, markMessageSeen);

export default router;
