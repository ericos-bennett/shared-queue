import express from 'express';
import { getAuthToken, getAuthCode } from '../controllers';
const router = express.Router();

router.get('/auth/token', getAuthToken);
router.get('/auth/code', getAuthCode);

export default router;