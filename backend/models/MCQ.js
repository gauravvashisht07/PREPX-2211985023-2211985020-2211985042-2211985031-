import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  attemptedQuestions: [{ type: Number }], // MCQ question IDs attempted
  answers: {
    type: Map,
    of: Number, // Map of questionId -> selectedOptionIndex
    default: new Map()
  },
  mcqStats: {
    DSA:  { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
    OS:   { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
    DBMS: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
    CN:   { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
    HR:   { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
  },
  totalAttemptsCount: { type: Number, default: 0 },
  totalCorrectCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('MCQ', mcqSchema);
