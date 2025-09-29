const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { name: username }]
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Create new user
    const user = new User({
      name: username,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log successful registration
    console.log(`New user registered: ${username} (${email})`);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
        joinedAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(error.errors)[0].message 
      });
    }
    
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    // Validate required fields
    if (!login || !password) {
      return res.status(400).json({ 
        error: 'Username/email and password are required' 
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { name: login }
      ]
    }).select('+password'); // Include password field for comparison

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`User logged in: ${user.name}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
        lastLoginAt: user.lastLoginAt,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get user profile (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences,
        joinedAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user preferences (protected)
router.put('/preferences', auth, async (req, res) => {
  try {
    const { theme, language, notifications, learningGoals } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update preferences
    if (theme) user.preferences.theme = theme;
    if (language) user.preferences.language = language;
    if (notifications !== undefined) user.preferences.notifications = notifications;
    if (learningGoals) user.preferences.learningGoals = learningGoals;

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password (protected)
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'New password must be at least 6 characters long' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    console.log(`Password changed for user: ${user.username}`);

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout (optional - mainly for logging)
router.post('/logout', auth, (req, res) => {
  console.log(`User logged out: ${req.user.username}`);
  res.json({ message: 'Logout successful' });
});

// Verify token (for frontend to check if user is still authenticated)
router.get('/verify', auth, (req, res) => {
  res.json({ 
    valid: true,
    user: {
      id: req.user.userId,
      username: req.user.username,
      email: req.user.email
    }
  });
});

module.exports = router;