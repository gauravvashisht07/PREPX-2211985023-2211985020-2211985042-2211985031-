import User from '../models/User.js';
import Progress from '../models/Progress.js';
import MCQ from '../models/MCQ.js';
import MockInterviewSession from '../models/MockInterviewSession.js';

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, targetRole, skillLevel, password } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (targetRole) user.targetRole = targetRole;
    if (skillLevel) user.skillLevel = skillLevel;
    
    if (password) {
      user.password = password; // Pre-save hook will hash it
    }

    await user.save();
    
    const updatedUser = await User.findById(req.userId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/user/stats
export const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Progress stats (Solved, Streak)
    const progress = await Progress.findOne({ userId });
    const solvedQuestions = progress?.solvedQuestions?.length || 0;
    const streak = progress?.streak || 0;

    // 2. MCQ stats (Accuracy)
    const mcq = await MCQ.findOne({ userId });
    const totalAttempts = mcq?.totalAttemptsCount || 0;
    const totalCorrect = mcq?.totalCorrectCount || 0;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    // 3. Mock Interview stats (Attempts)
    const mockSessionsCount = await MockInterviewSession.countDocuments({ 
      userId, 
      status: 'completed' 
    });

    res.json({
      solvedQuestions,
      streak,
      accuracy,
      mockSessionsCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
