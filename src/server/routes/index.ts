import express from 'express';
import { getAuthCode, getAuthTokens } from '../controllers';
const router = express.Router();

router.get('/auth/code', getAuthCode);
router.get('/auth/token', getAuthTokens);

export default router;