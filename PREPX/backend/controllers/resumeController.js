import Resume from '../models/Resume.js';

export const getResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.userId });
    if (!resume) resume = await Resume.create({ userId: req.userId });
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const saveResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, userId: req.userId },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
