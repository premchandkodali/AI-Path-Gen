const express = require('express');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, topic, completed } = req.query;

    // Build query
    const query = { userId: req.user.userId };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }
    
    if (completed !== undefined) {
      query.isCompleted = completed === 'true';
    }

    // Execute query with pagination
    const courses = await Course.find(query)
      .sort({ lastAccessed: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Fetch courses error:', error);
    res.status(500).json({ error: 'Server error while fetching courses' });
  }
});

// Get specific course by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update last accessed
    await course.updateLastAccessed();

    res.json(course);

  } catch (error) {
    console.error('Fetch course error:', error);
    res.status(500).json({ error: 'Server error while fetching course' });
  }
});

// Create new course
router.post('/', auth, async (req, res) => {
  try {
    const { courseTitle, description, topic, lessons, difficulty, tags } = req.body;

    // Validate required fields
    if (!courseTitle || !topic || !lessons || lessons.length === 0) {
      return res.status(400).json({ 
        error: 'Course title, topic, and at least one lesson are required' 
      });
    }

    // Calculate estimated duration
    const estimatedDuration = lessons.reduce((total, lesson) => {
      return total + (lesson.duration || 30);
    }, 0);

    // Create course
    const course = new Course({
      userId: req.user.userId,
      courseTitle,
      description,
      topic,
      lessons,
      difficulty: difficulty || 'beginner',
      estimatedDuration,
      tags: tags || []
    });

    await course.save();

    console.log(`New course created: "${courseTitle}" by ${req.user.username}`);

    res.status(201).json({
      message: 'Course created successfully',
      course
    });

  } catch (error) {
    console.error('Create course error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(error.errors)[0].message 
      });
    }
    
    res.status(500).json({ error: 'Server error while creating course' });
  }
});

// Update course
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { courseTitle, description, lessons, difficulty, tags, isPublic } = req.body;

    // Update fields if provided
    if (courseTitle) course.courseTitle = courseTitle;
    if (description !== undefined) course.description = description;
    if (lessons) {
      course.lessons = lessons;
      // Recalculate estimated duration
      course.estimatedDuration = lessons.reduce((total, lesson) => {
        return total + (lesson.duration || 30);
      }, 0);
    }
    if (difficulty) course.difficulty = difficulty;
    if (tags) course.tags = tags;
    if (isPublic !== undefined) course.isPublic = isPublic;

    await course.save();

    res.json({
      message: 'Course updated successfully',
      course
    });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Server error while updating course' });
  }
});

// Update lesson progress
router.put('/:id/progress/:lessonId', auth, async (req, res) => {
  try {
    const { completed, currentPage, timeSpent } = req.body;

    const course = await Course.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if lesson exists
    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Update progress
    await course.updateLessonProgress(req.params.lessonId, {
      completed: completed || false,
      currentPage: currentPage || 0,
      timeSpent: timeSpent || 0
    });

    res.json({
      message: 'Progress updated successfully',
      progressPercentage: course.progressPercentage,
      isCompleted: course.isCompleted
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Server error while updating progress' });
  }
});

// Get course progress
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const progressData = {
      courseId: course._id,
      progressPercentage: course.progressPercentage,
      totalTimeSpent: course.totalTimeSpent,
      isCompleted: course.isCompleted,
      completedAt: course.completedAt,
      lessons: course.lessons.map(lesson => {
        const progress = course.progress.find(p => 
          p.lessonId.toString() === lesson._id.toString()
        );
        
        return {
          lessonId: lesson._id,
          title: lesson.lessonTitle,
          order: lesson.order,
          progress: progress || {
            completed: false,
            currentPage: 0,
            timeSpent: 0
          }
        };
      })
    };

    res.json(progressData);

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Server error while fetching progress' });
  }
});

// Delete course
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await Course.deleteOne({ _id: req.params.id });

    console.log(`Course deleted: "${course.courseTitle}" by ${req.user.username}`);

    res.json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Server error while deleting course' });
  }
});

// Get dashboard statistics
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalTimeSpent
    ] = await Promise.all([
      Course.countDocuments({ userId }),
      Course.countDocuments({ userId, isCompleted: true }),
      Course.countDocuments({ 
        userId, 
        isCompleted: false,
        'progress.0': { $exists: true }
      }),
      Course.aggregate([
        { $match: { userId: req.user.userId } },
        { $unwind: '$progress' },
        { $group: { _id: null, total: { $sum: '$progress.timeSpent' } } }
      ])
    ]);

    const recentCourses = await Course.find({ userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select('courseTitle topic progressPercentage lastAccessed');

    res.json({
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalTimeSpent: totalTimeSpent[0]?.total || 0,
      recentCourses
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
});

module.exports = router;