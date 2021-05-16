import express from 'express';
import {
  getAuthCode,
  authenticateUser,
} from '../controllers';

const router = express.Router();

// Auth routes
router.get('/auth/code', getAuthCode);
router.get('/auth/token', authenticateUser);

export default router;
