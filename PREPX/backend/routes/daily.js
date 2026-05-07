import express from 'express';
import auth from '../middleware/auth.js';
import { getDailyChallenge, completeDaily } from '../controllers/dailyController.js';
const router = express.Router();
router.get('/challenge', auth, getDailyChallenge);
router.post('/complete', auth, completeDaily);
export default router;
