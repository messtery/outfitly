import express from 'express';
import {
  createChat,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/', createChat);

export default router;
