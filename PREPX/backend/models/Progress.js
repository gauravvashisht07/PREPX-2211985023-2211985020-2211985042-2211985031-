import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  solvedQuestions: [{ type: Number }], // question IDs
  streak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: '' }, // YYYY-MM-DD
  activityLog: [{ type: String }], // array of 'YYYY-MM-DD' strings
  completedDailyChallenges: [{ type: String }], // 'YYYY-MM-DD' strings
  topicStats: {
    DSA:  { solved: { type: Number, default: 0 }, total: { type: Number, default: 15 } },
    OS:   { solved: { type: Number, default: 0 }, total: { type: Number, default: 7 } },
    DBMS: { solved: { type: Number, default: 0 }, total: { type: Number, default: 8 } },
    CN:   { solved: { type: Number, default: 0 }, total: { type: Number, default: 7 } },
    HR:   { solved: { type: Number, default: 0 }, total: { type: Number, default: 8 } },
  },
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
