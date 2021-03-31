import express from 'express';
import { getAuthCode, getAuthTokens, createPlaylist } from '../controllers';
const router = express.Router();

router.get('/auth/code', getAuthCode);
router.get('/auth/token', getAuthTokens);

router.post('/playlist', createPlaylist)

export default router;