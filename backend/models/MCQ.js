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
    type: Object,
    default: {
      DSA:  { attempted: 0, correct: 0 },
      OS:   { attempted: 0, correct: 0 },
      DBMS: { attempted: 0, correct: 0 },
      CN:   { attempted: 0, correct: 0 },
      HR:   { attempted: 0, correct: 0 },
    }
  },
  totalAttemptsCount: { type: Number, default: 0 },
  totalCorrectCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('MCQ', mcqSchema);
