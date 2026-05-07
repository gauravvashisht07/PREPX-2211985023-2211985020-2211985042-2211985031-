import Progress from '../models/Progress.js';

// Static pool size — matches frontend/src/data/dailyChallenges.js
const POOL_SIZE = 30;

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

export const getDailyChallenge = async (req, res) => {
  try {
    const index = getDayOfYear() % POOL_SIZE;
    const today = new Date().toISOString().slice(0, 10);

    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    const completed = progress.completedDailyChallenges.includes(today);
    res.json({ challengeIndex: index, today, completed });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const completeDaily = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    if (!progress.completedDailyChallenges.includes(today)) {
      progress.completedDailyChallenges.push(today);
      // Also count as activity for streak
      if (!progress.activityLog.includes(today)) progress.activityLog.push(today);
      progress.lastActiveDate = today;
      await progress.save();
    }
    res.json({ message: 'Daily challenge marked complete', today });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
