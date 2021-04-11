import express from 'express';
import { 
  getAuthCode, authenticateUser, 
  createRoom, getRoom, deleteTrack, addTrack,
  searchTrack 
} from '../controllers';

const router = express.Router();

// Auth routes
router.get('/auth/code', getAuthCode);
router.get('/auth/token', authenticateUser);

// Room routes
router.post('/room', createRoom);
router.get('/room/:id', getRoom);
router.delete('/room/:playlistId/:index', deleteTrack);
router.put('/room/:playlistId', addTrack)

// Search routes
router.get('/search/:query', searchTrack)

export default router;
