import express from 'express';
import { getAuthCode, getAuthToken, createRoom, getRoom, deleteTrack, searchTrack } from '../controllers';
const router = express.Router();

// Auth routes
router.get('/auth/code', getAuthCode);
router.get('/auth/token', getAuthToken);

// Room routes
router.post('/room', createRoom);
router.get('/room/:id', getRoom);
router.delete('/room/:playlistId/:index', deleteTrack);

// Search routes
router.get('/search/:query', searchTrack)

export default router;
