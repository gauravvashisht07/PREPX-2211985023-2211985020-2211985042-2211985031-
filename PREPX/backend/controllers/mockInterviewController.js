import MockInterviewSession from '../models/MockInterviewSession.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';

/**
 * Save a completed mock interview session
 */
export const saveSession = async (req, res) => {
  try {
    const { questions, totalScore, totalQuestions, sessionName } = req.body;
    const userId = req.userId;

    const session = new MockInterviewSession({
      userId,
      sessionName: sessionName || 'Mock Interview Session',
      questions,
      totalScore,
      totalQuestions,
      status: 'completed',
      completedAt: new Date(),
    });

    await session.save();
    logger.info(`Mock Interview Session saved for user ${userId}`);
    return sendSuccess(res, 'Session saved successfully', session);
  } catch (error) {
    logger.error(`Error saving mock session: ${error.message}`);
    return sendError(res, 'Failed to save session');
  }
};

/**
 * Get user's mock interview history
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const sessions = await MockInterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return sendSuccess(res, 'History retrieved', sessions);
  } catch (error) {
    logger.error(`Error fetching mock history: ${error.message}`);
    return sendError(res, 'Failed to fetch history');
  }
};

/**
 * Get a specific session detail
 */
export const getSessionById = async (req, res) => {
  try {
    const session = await MockInterviewSession.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!session) {
      return sendError(res, 'Session not found', 404);
    }

    return sendSuccess(res, 'Session retrieved', session);
  } catch (error) {
    logger.error(`Error fetching session detail: ${error.message}`);
    return sendError(res, 'Failed to fetch session detail');
  }
};
