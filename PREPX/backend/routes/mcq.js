import express from 'express';
import auth from '../middleware/auth.js';
import { getMCQProgress, submitMCQAnswer, resetMCQProgress } from '../controllers/mcqController.js';

const router = express.Router();

router.get('/', auth, getMCQProgress);
router.post('/answer', auth, submitMCQAnswer);
router.post('/reset', auth, resetMCQProgress);

export default router;
