import mongoose from 'mongoose';

const mockInterviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionName: { type: String, default: 'Mock Interview Session' },
    questions: [
      {
        questionText: String,
        userAnswer: String,
        expectedTopics: String,
        difficulty: String,
        feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
        aiFeedback: String,
        score: { type: Number, min: 0, max: 100 },
        answeredAt: { type: Date, default: Date.now },
      },
    ],
    totalScore: { type: Number, default: 0 }, // Average of all scores
    totalQuestions: { type: Number, default: 0 },
    completedAt: { type: Date },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
  },
  { timestamps: true }
);

mockInterviewSessionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('MockInterviewSession', mockInterviewSessionSchema);
