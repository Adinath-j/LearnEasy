// ===== SERVER.JS - Main Application Entry Point =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const moduleRoutes = require('./routes/modules');
const lessonRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const aiRoutes = require('./routes/ai');
const simulationRoutes = require('./routes/simulations');

const app = express();

// Security and Performance Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edutech_mastery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/simulations', simulationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ===== MODELS/USER.JS - User Schema =====
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
  category: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'special'] }
});

const progressSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  completedAt: { type: Date, default: Date.now },
  score: { type: Number, min: 0, max: 100 },
  timeSpent: { type: Number, default: 0 }, // in minutes
  attempts: { type: Number, default: 1 }
});

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    school: { type: String },
    subject: { type: String },
    gradeLevel: { type: String },
    yearsOfExperience: { type: Number, min: 0 }
  },
  progress: {
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    completedModules: [progressSchema],
    badges: [badgeSchema],
    streak: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: Date.now },
    totalTimeSpent: { type: Number, default: 0 } // in minutes
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
  },
  createdLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  favoriteModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['teacher', 'admin'], default: 'teacher' }
}, {
  timestamps: true
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

// Calculate level from XP
userSchema.methods.calculateLevel = function() {
  this.progress.level = Math.floor(this.progress.xp / 1000) + 1;
  return this.progress.level;
};

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastLogin = new Date(this.progress.lastLoginDate).setHours(0, 0, 0, 0);
  const dayDifference = (today - lastLogin) / (1000 * 60 * 60 * 24);
  
  if (dayDifference === 1) {
    this.progress.streak += 1;
  } else if (dayDifference > 1) {
    this.progress.streak = 1;
  }
  
  this.progress.lastLoginDate = new Date();
};

module.exports = mongoose.model('User', userSchema);

// ===== MODELS/MODULE.JS - Training Module Schema =====
const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['click', 'drag', 'input', 'selection'], required: true },
  element: { type: String, required: true },
  expectedAction: { type: String, required: true },
  feedback: { type: String, required: true }
});

const simulationSchema = new mongoose.Schema({
  type: { type: String, enum: ['smartboard', 'polling', 'quiz', 'collaboration'], required: true },
  config: { type: mongoose.Schema.Types.Mixed }, // Flexible configuration object
  interactions: [interactionSchema],
  resources: [{
    type: { type: String, enum: ['image', 'video', 'audio', 'document'] },
    url: { type: String, required: true },
    description: { type: String }
  }]
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    required: true 
  },
  category: {
    type: String,
    enum: ['smartboard', 'digital-tools', 'collaboration', 'assessment', 'general'],
    required: true
  },
  duration: { type: Number, required: true }, // in minutes
  xpReward: { type: Number, required: true },
  
  content: {
    overview: { type: String, required: true },
    learningObjectives: [{ type: String, required: true }],
    sections: [{
      title: { type: String, required: true },
      content: { type: String, required: true },
      type: { type: String, enum: ['text', 'video', 'interactive', 'quiz'] },
      resources: [{ type: String }] // URLs to additional resources
    }]
  },
  
  simulation: simulationSchema,
  
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  tags: [{ type: String }],
  
  assessment: {
    questions: [{
      question: { type: String, required: true },
      type: { type: String, enum: ['multiple-choice', 'true-false', 'short-answer'] },
      options: [{ type: String }], // For multiple choice
      correctAnswer: { type: String, required: true },
      explanation: { type: String }
    }],
    passingScore: { type: Number, default: 70 }
  },
  
  analytics: {
    totalCompletions: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    difficultyRating: { type: Number, default: 0 } // User feedback
  },
  
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Index for search functionality
moduleSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Module', moduleSchema);

// ===== MODELS/LESSON.JS - Community Lesson Schema =====
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { 
    type: String, 
    required: true,
    enum: ['Math', 'Science', 'English', 'History', 'Art', 'PE', 'Other']
  },
  gradeLevel: { 
    type: String, 
    required: true,
    enum: ['K-2', '3-5', '6-8', '9-12', 'College', 'Adult']
  },
  
  content: {
    objectives: [{ type: String, required: true }],
    materials: [{ type: String }],
    procedure: [{ 
      step: { type: Number, required: true },
      instruction: { type: String, required: true },
      duration: { type: Number }, // in minutes
      tools: [{ type: String }]
    }],
    assessment: { type: String },
    homework: { type: String }
  },
  
  digitalTools: [{ 
    type: String, 
    enum: [
      'Smart Board', 'Real-time Polls', 'Video Conferencing', 'Interactive Games',
      'Digital Quizzes', 'Collaboration Tools', '3D Simulations', 'AR/VR',
      'Screen Sharing', '