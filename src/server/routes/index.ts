import express from 'express';
import { getAuthCode, getAuthToken, createRoom } from '../controllers';
const router = express.Router();

// Auth routes
router.get('/auth/code', getAuthCode);
router.get('/auth/token', getAuthToken);

// Room routes
router.post('/room', createRoom);

export default router;
