import express from 'express';
import { getAuthCode, getAuthToken, createRoom } from '../controllers';
const router = express.Router();

router.get('/auth/code', getAuthCode);
router.get('/auth/token', getAuthToken);

router.post('/room', createRoom);

export default router;
