const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @desc    Get user profile
// @route   GET /api/profile/:userId
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    // Ensure user can only access their own profile
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Create user profile
// @route   POST /api/profile
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      role,
      skills,
      certificates,
      learningActivity,
      stats
    } = req.body;

    // Use the authenticated user's ID
    const userId = req.user.userId;

    const newUser = new User({
      _id: userId,
      name: name || req.user.username,
      email: email || req.user.email,
      phone: phone || '',
      location: location || '',
      role: role || 'Student',
      skills: skills || [],
      certificates: certificates || [],
      learningActivity: learningActivity || [],
      stats: stats || {
        coursesCompleted: 0,
        certificatesEarned: 0,
        learningStreak: 0,
        hoursLearned: 0
      },
      joinDate: new Date(),
      updatedAt: new Date()
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user profile:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User profile already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/profile/:userId
// @access  Private
router.put('/:userId', auth, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Add skill to user profile
// @route   POST /api/profile/:userId/skills
// @access  Private
router.post('/:userId/skills', auth, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, level, category } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.skills.push({ name, level, category });
    user.updatedAt = new Date();
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update learning progress
// @route   PUT /api/profile/:userId/progress
// @access  Private
router.put('/:userId/progress', auth, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { courseId, progress, status } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find and update the learning activity
    const activityIndex = user.learningActivity.findIndex(
      activity => activity.course === courseId
    );

    if (activityIndex !== -1) {
      user.learningActivity[activityIndex].progress = progress;
      user.learningActivity[activityIndex].status = status;
    } else {
      user.learningActivity.push({
        course: courseId,
        progress,
        status
      });
    }

    // Update stats if course is completed
    if (status === 'Completed') {
      user.stats.coursesCompleted += 1;
      user.stats.hoursLearned += Math.floor(Math.random() * 10) + 5; // Estimated hours
    }

    user.updatedAt = new Date();
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Delete user profile
// @route   DELETE /api/profile/:userId
// @access  Private
router.delete('/:userId', auth, async (req, res) => {
  try {
    // Ensure user can only delete their own profile
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;