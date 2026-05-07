import express from 'express';
import auth from '../middleware/auth.js';
import { saveSession, getHistory, getSessionById } from '../controllers/mockInterviewController.js';

const router = express.Router();

/**
 * @route   POST /api/mock
 * @desc    Save a mock interview session
 * @access  Private
 */
router.post('/', auth, saveSession);

/**
 * @route   GET /api/mock/history
 * @desc    Get user's session history
 * @access  Private
 */
router.get('/history', auth, getHistory);

/**
 * @route   GET /api/mock/:id
 * @desc    Get a specific session
 * @access  Private
 */
router.get('/:id', auth, getSessionById);

export default router;
