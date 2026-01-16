import { changeProfile, } from "../controllers/userController.js";
import express from'express';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


router.put('/change', verifyToken, changeProfile);


export default router;