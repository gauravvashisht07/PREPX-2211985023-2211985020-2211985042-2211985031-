import { evaluateAnswer } from '../utils/aiEvaluator.js';

/**
 * POST /api/ai/evaluate
 * Evaluates a user's answer against the correct answer.
 *
 * Body: { question: string, userAnswer: string, correctAnswer: string }
 * Response: { score: number, feedback: string, suggestions: string }
 */
export async function evaluateAnswerHandler(req, res) {
  try {
    const { question, userAnswer, correctAnswer } = req.body;

    // Validate input
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required.' });
    }
    if (!userAnswer || typeof userAnswer !== 'string' || !userAnswer.trim()) {
      return res.status(400).json({ error: 'userAnswer is required and cannot be empty.' });
    }
    if (!correctAnswer || typeof correctAnswer !== 'string') {
      return res.status(400).json({ error: 'correctAnswer is required.' });
    }

    const result = evaluateAnswer(question, userAnswer, correctAnswer);
    return res.status(200).json(result);

  } catch (err) {
    console.error('[AI Evaluate] Error:', err.message);
    return res.status(500).json({ error: 'Evaluation failed. Please try again.' });
  }
}
