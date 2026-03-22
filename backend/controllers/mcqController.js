import MCQ from '../models/MCQ.js';
import { mcqQuestions } from '../data/mcqQuestions.js';

const getMCQProgress = async (req, res) => {
  try {
    let mcq = await MCQ.findOne({ userId: req.userId });
    if (!mcq) {
      mcq = await MCQ.create({ userId: req.userId });
    }
    res.json({
      attemptedQuestions: mcq.attemptedQuestions,
      answers: Object.fromEntries(mcq.answers),
      mcqStats: mcq.mcqStats,
      totalCorrectCount: mcq.totalCorrectCount,
      totalAttemptsCount: mcq.totalAttemptsCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const submitMCQAnswer = async (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;

    if (typeof questionId !== 'number' || typeof selectedOption !== 'number') {
      return res.status(400).json({ message: 'Invalid questionId or selectedOption' });
    }

    let mcq = await MCQ.findOne({ userId: req.userId });
    if (!mcq) {
      mcq = await MCQ.create({ userId: req.userId });
    }

    const isNewAttempt = !mcq.attemptedQuestions.includes(questionId);

    // Update attempted questions list
    if (isNewAttempt) {
      mcq.attemptedQuestions.push(questionId);
      mcq.totalAttemptsCount += 1;
    }

    // Get question data
    const question = mcqQuestions.find(q => q.id === questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if answer is correct
    const wasCorrectBefore = mcq.answers.get(String(questionId)) === question.correctAnswer;
    const isCorrectNow = selectedOption === question.correctAnswer;

    // Update stats
    if (isNewAttempt && isCorrectNow) {
      mcq.totalCorrectCount += 1;
      mcq.mcqStats[question.topic].correct += 1;
      mcq.mcqStats[question.topic].attempted += 1;
    } else if (isNewAttempt && !isCorrectNow) {
      mcq.mcqStats[question.topic].attempted += 1;
    } else if (!isNewAttempt) {
      // User is changing their answer
      if (wasCorrectBefore && !isCorrectNow) {
        // Changed from correct to incorrect
        mcq.totalCorrectCount -= 1;
        mcq.mcqStats[question.topic].correct -= 1;
      } else if (!wasCorrectBefore && isCorrectNow) {
        // Changed from incorrect to correct
        mcq.totalCorrectCount += 1;
        mcq.mcqStats[question.topic].correct += 1;
      }
    }

    // Store the answer
    mcq.answers.set(String(questionId), selectedOption);

    await mcq.save();

    res.json({
      success: true,
      attemptedQuestions: mcq.attemptedQuestions,
      answers: Object.fromEntries(mcq.answers),
      mcqStats: mcq.mcqStats,
      totalCorrectCount: mcq.totalCorrectCount,
      totalAttemptsCount: mcq.totalAttemptsCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetMCQProgress = async (req, res) => {
  try {
    const mcq = await MCQ.findOne({ userId: req.userId });
    if (!mcq) {
      return res.status(404).json({ message: 'MCQ progress not found' });
    }

    mcq.attemptedQuestions = [];
    mcq.answers = new Map();
    mcq.totalAttemptsCount = 0;
    mcq.totalCorrectCount = 0;
    
    // Reset stats
    Object.keys(mcq.mcqStats).forEach(topic => {
      mcq.mcqStats[topic].attempted = 0;
      mcq.mcqStats[topic].correct = 0;
    });

    await mcq.save();

    res.json({ message: 'MCQ progress reset successfully', mcq });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getMCQProgress, submitMCQAnswer, resetMCQProgress };
