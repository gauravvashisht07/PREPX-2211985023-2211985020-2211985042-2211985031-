import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  dueDate: { type: String, default: '' }, // YYYY-MM-DD
  completed: { type: Boolean, default: false },
  topic: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);
