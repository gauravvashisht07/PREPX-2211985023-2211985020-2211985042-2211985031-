import Progress from '../models/Progress.js';

const todayStr = () => new Date().toISOString().slice(0, 10);

const updateStreak = (progress) => {
  const today = todayStr();
  const last = progress.lastActiveDate;
  if (last === today) return; // already active today

  if (!progress.activityLog.includes(today)) progress.activityLog.push(today);
  progress.lastActiveDate = today;

  if (!last) { progress.streak = 1; }
  else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    progress.streak = (last === yStr) ? progress.streak + 1 : 1;
  }
  progress.maxStreak = Math.max(progress.maxStreak, progress.streak);
};

export const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const markSolved = async (req, res) => {
  try {
    const { questionId, topic } = req.body;
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    if (!progress.solvedQuestions.includes(questionId)) {
      progress.solvedQuestions.push(questionId);
      if (topic && progress.topicStats[topic]) {
        progress.topicStats[topic].solved = Math.min(
          progress.topicStats[topic].solved + 1,
          progress.topicStats[topic].total
        );
      }
      updateStreak(progress);
      await progress.save();
    }
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const unmarkSolved = async (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    const progress = await Progress.findOne({ userId: req.userId });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    progress.solvedQuestions = progress.solvedQuestions.filter(id => id !== questionId);
    await progress.save();
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
