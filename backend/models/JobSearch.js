const mongoose = require('mongoose');

const jobSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  avgSalary: {
    type: String, // e.g., "₹8.5 LPA"
    required: true
  },
  openPositions: {
    type: Number, // e.g., 15200
    required: true
  },
  jobGrowth: {
    type: Number, // e.g., 22 (for 22%)
    required: true
  },
  searchedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
jobSearchSchema.index({ userId: 1, searchedAt: -1 });
jobSearchSchema.index({ userId: 1, jobTitle: 1 }, { unique: true }); // Prevent duplicate job titles per user

module.exports = mongoose.model('JobSearch', jobSearchSchema);