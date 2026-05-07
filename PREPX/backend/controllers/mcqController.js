import MCQ from '../models/MCQ.js';

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
    console.error('MCQ Progress Error:', err);
    res.status(500).json({ message: err.message });
  }
};

const submitMCQAnswer = async (req, res) => {
  try {
    const { questionId, selectedOption, topic, isCorrect } = req.body;

    // Validate input
    if (typeof questionId !== 'number' || typeof selectedOption !== 'number') {
      return res.status(400).json({ message: 'Invalid questionId or selectedOption' });
    }
    if (questionId < 0 || selectedOption < 0) {
      return res.status(400).json({ message: 'questionId and selectedOption must be non-negative' });
    }

    let mcq = await MCQ.findOne({ userId: req.userId });
    if (!mcq) {
      mcq = await MCQ.create({
        userId: req.userId,
        attemptedQuestions: [],
        answers: new Map(),
        mcqStats: { DSA: { attempted: 0, correct: 0 }, OS: { attempted: 0, correct: 0 }, DBMS: { attempted: 0, correct: 0 }, CN: { attempted: 0, correct: 0 }, HR: { attempted: 0, correct: 0 } },
        totalAttemptsCount: 0,
        totalCorrectCount: 0,
      });
    }

    const isNewAttempt = !mcq.attemptedQuestions.includes(questionId);

    // Track attempts
    if (isNewAttempt) {
      mcq.attemptedQuestions.push(questionId);
      mcq.totalAttemptsCount += 1;
    }

    // Update stats using topic + isCorrect sent from frontend (frontend has the question data)
    const qTopic = topic || 'DSA';
    if (!mcq.mcqStats[qTopic]) {
      mcq.mcqStats[qTopic] = { attempted: 0, correct: 0 };
    }

    const prevAnswer = mcq.answers.get(String(questionId));
    const wasCorrectBefore = prevAnswer !== undefined && !isNewAttempt
      ? mcq.answers.get(`correct_${questionId}`) === true
      : false;

    if (isNewAttempt) {
      mcq.mcqStats[qTopic].attempted += 1;
      if (isCorrect) {
        mcq.totalCorrectCount += 1;
        mcq.mcqStats[qTopic].correct += 1;
      }
    } else {
      // Changing answer
      if (wasCorrectBefore && !isCorrect) {
        mcq.totalCorrectCount = Math.max(0, mcq.totalCorrectCount - 1);
        mcq.mcqStats[qTopic].correct = Math.max(0, mcq.mcqStats[qTopic].correct - 1);
      } else if (!wasCorrectBefore && isCorrect) {
        mcq.totalCorrectCount += 1;
        mcq.mcqStats[qTopic].correct += 1;
      }
    }

    // Store the answer and correctness flag
    mcq.answers.set(String(questionId), selectedOption);
    mcq.answers.set(`correct_${questionId}`, isCorrect ? 1 : 0);

    mcq.markModified('mcqStats');
    mcq.markModified('answers');
    await mcq.save();

    // Convert answers map back, excluding the correctness flags
    const answersObj = {};
    mcq.answers.forEach((val, key) => {
      if (!key.startsWith('correct_')) answersObj[key] = val;
    });

    res.json({
      success: true,
      attemptedQuestions: mcq.attemptedQuestions,
      answers: answersObj,
      mcqStats: mcq.mcqStats,
      totalCorrectCount: mcq.totalCorrectCount,
      totalAttemptsCount: mcq.totalAttemptsCount,
    });
  } catch (err) {
    console.error('MCQ Submit Error:', err);
    res.status(500).json({ message: err.message });
  }
};

const resetMCQProgress = async (req, res) => {
  try {
    const mcq = await MCQ.findOne({ userId: req.userId });
    if (!mcq) return res.status(404).json({ message: 'MCQ progress not found' });

    mcq.attemptedQuestions = [];
    mcq.answers = new Map();
    mcq.totalAttemptsCount = 0;
    mcq.totalCorrectCount = 0;
    mcq.mcqStats = { DSA: { attempted: 0, correct: 0 }, OS: { attempted: 0, correct: 0 }, DBMS: { attempted: 0, correct: 0 }, CN: { attempted: 0, correct: 0 }, HR: { attempted: 0, correct: 0 } };

    await mcq.save();
    res.json({ message: 'MCQ progress reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getMCQProgress, submitMCQAnswer, resetMCQProgress };
