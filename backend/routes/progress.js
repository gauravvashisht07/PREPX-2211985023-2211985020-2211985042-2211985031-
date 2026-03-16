import express from 'express';
import auth from '../middleware/auth.js';
import { getProgress, markSolved, unmarkSolved } from '../controllers/progressController.js';
const router = express.Router();
router.get('/', auth, getProgress);
router.post('/solved', auth, markSolved);
router.delete('/solved/:id', auth, unmarkSolved);
export default router;
