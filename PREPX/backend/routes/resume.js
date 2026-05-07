import express from 'express';
import auth from '../middleware/auth.js';
import { getResume, saveResume } from '../controllers/resumeController.js';
const router = express.Router();
router.get('/', auth, getResume);
router.put('/', auth, saveResume);
export default router;
