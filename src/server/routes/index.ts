import express from 'express';
import { getAuthCode, getAuthToken, createRoom, getRoom } from '../controllers';
const router = express.Router();

// Auth routes
router.get('/auth/code', getAuthCode);
router.get('/auth/token', getAuthToken);

// Room routes
router.post('/room', createRoom);
router.get(`/room/:id`, getRoom);

export default router;
