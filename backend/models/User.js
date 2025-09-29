const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  credentialId: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const learningActivitySchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Not Started'],
    required: true
  }
});

const statsSchema = new mongoose.Schema({
  coursesCompleted: {
    type: Number,
    default: 0
  },
  certificatesEarned: {
    type: Number,
    default: 0
  },
  learningStreak: {
    type: Number,
    default: 0
  },
  hoursLearned: {
    type: Number,
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'Student'
  },
  skills: [skillSchema],
  certificates: [certificateSchema],
  learningActivity: [learningActivitySchema],
  stats: {
    type: statsSchema,
    default: () => ({})
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    select: false // Don't return password by default
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  preferences: {
    learningGoals: [String],
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    preferredLanguage: {
      type: String,
      default: 'english'
    }
  },
  profile: {
    pursuing: {
      type: String,
      default: ''
    },
    currentSkills: {
      type: String,
      default: ''
    },
    jobField: {
      type: String,
      default: ''
    },
    managingPeople: {
      type: String,
      default: ''
    },
    occupation: {
      type: String,
      default: ''
    },
    skillsToLearn: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total courses
userSchema.virtual('totalCourses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'userId',
  count: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = async function() {
  // Use updateOne to avoid version conflicts
  await this.constructor.updateOne(
    { _id: this._id },
    { lastLogin: new Date() }
  );
};

module.exports = mongoose.model('User', userSchema);