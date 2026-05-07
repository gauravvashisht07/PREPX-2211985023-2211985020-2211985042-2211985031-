import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  personal: {
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    summary: { type: String, default: '' },
  },
  education: [{
    institution: String, degree: String, field: String,
    startYear: String, endYear: String, cgpa: String,
  }],
  experience: [{
    company: String, role: String, startDate: String,
    endDate: String, current: Boolean, description: String,
  }],
  projects: [{
    title: String, tech: String, description: String, link: String,
  }],
  skills: [{
    category: String, items: String,
  }],
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
