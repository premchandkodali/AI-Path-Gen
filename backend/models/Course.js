const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  examples: [{
    type: String
  }],
  steps: [{
    type: String
  }],
  code: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  }
});

const pageSchema = new mongoose.Schema({
  sections: [sectionSchema],
  pageNumber: {
    type: Number,
    required: true
  }
});

const lessonSchema = new mongoose.Schema({
  lessonTitle: {
    type: String,
    required: true
  },
  objectives: [{
    type: String
  }],
  content: [pageSchema],
  duration: {
    type: Number, // in minutes
    default: 30
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  order: {
    type: Number,
    required: true
  }
});

const progressSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseTitle: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  lessons: [lessonSchema],
  thumbnail: {
    type: String,
    default: '/placeholder.svg'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedDuration: {
    type: Number, // total duration in minutes
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  progress: [progressSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for overall progress percentage
courseSchema.virtual('progressPercentage').get(function() {
  if (!this.lessons || this.lessons.length === 0) return 0;
  
  const totalLessons = this.lessons.length;
  const completedLessons = this.progress.filter(p => p.completed).length;
  
  return Math.round((completedLessons / totalLessons) * 100);
});

// Virtual for total time spent
courseSchema.virtual('totalTimeSpent').get(function() {
  if (!this.progress || this.progress.length === 0) return 0;
  return this.progress.reduce((total, p) => total + (p.timeSpent || 0), 0);
});

// Update last accessed when course is viewed
courseSchema.methods.updateLastAccessed = async function() {
  this.lastAccessed = new Date();
  return await this.save();
};

// Update lesson progress
courseSchema.methods.updateLessonProgress = async function(lessonId, progressData) {
  const existingProgress = this.progress.find(p => p.lessonId.toString() === lessonId.toString());
  
  if (existingProgress) {
    Object.assign(existingProgress, progressData);
    existingProgress.lastAccessed = new Date();
    if (progressData.completed) {
      existingProgress.completedAt = new Date();
    }
  } else {
    this.progress.push({
      lessonId,
      ...progressData,
      lastAccessed: new Date()
    });
  }
  
  // Check if course is completed
  const totalLessons = this.lessons.length;
  const completedLessons = this.progress.filter(p => p.completed).length;
  
  if (completedLessons === totalLessons && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  return await this.save();
};

// Index for better query performance
courseSchema.index({ userId: 1, createdAt: -1 });
courseSchema.index({ topic: 1 });
courseSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Course', courseSchema);