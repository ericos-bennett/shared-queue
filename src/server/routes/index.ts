import express from 'express';
import { createRoom } from '../controllers';
const router = express.Router();

router.post('/room', createRoom);

export default router;