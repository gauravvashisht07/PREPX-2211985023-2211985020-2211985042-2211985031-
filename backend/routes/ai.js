import { Router } from 'express';
import { evaluateAnswerHandler } from '../controllers/aiController.js';
import auth from '../middleware/auth.js';

const router = Router();

// POST /api/ai/evaluate — protected, requires valid JWT
router.post('/evaluate', auth, evaluateAnswerHandler);

export default router;
