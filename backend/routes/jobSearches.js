const express = require('express');
const JobSearch = require('../models/JobSearch');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// Get all job searches for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Execute query with pagination - newest first
    const jobSearches = await JobSearch.find({ userId: req.user.userId })
      .sort({ lastAccessed: -1, searchedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobSearch.countDocuments({ userId: req.user.userId });

    res.json({
      jobSearches,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Fetch job searches error:', error);
    res.status(500).json({ error: 'Server error while fetching job searches' });
  }
});

// Get specific job search by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const jobSearch = await JobSearch.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!jobSearch) {
      return res.status(404).json({ error: 'Job search not found' });
    }

    // Update last accessed
    jobSearch.lastAccessed = new Date();
    await jobSearch.save();

    res.json(jobSearch);
  } catch (error) {
    console.error('Fetch job search error:', error);
    res.status(500).json({ error: 'Server error while fetching job search' });
  }
});

// Create/Update job search by calling Flask AI service
router.post('/search', auth, async (req, res) => {
  try {
    const { jobTitle } = req.body;

    if (!jobTitle || jobTitle.trim() === '') {
      return res.status(400).json({ error: 'Job title is required' });
    }

    console.log(`🔍 Searching for job insights: ${jobTitle} for user: ${req.user.userId}`);

    // Call Flask AI service
    try {
      const flaskResponse = await axios.get(`http://localhost:5000/api/career-insights`, {
        params: { job_title: jobTitle.trim() },
        timeout: 30000 // 30 seconds timeout
      });

      const aiData = flaskResponse.data;

      // Check if we got valid data from AI
      if (!aiData.average_salary || !aiData.open_positions || aiData.job_growth_yoy === null) {
        return res.status(500).json({ 
          error: 'Failed to get complete job insights from AI service',
          partial_data: aiData 
        });
      }

      // Check if user already searched for this job title
      let jobSearch = await JobSearch.findOne({
        userId: req.user.userId,
        jobTitle: { $regex: new RegExp(`^${jobTitle.trim()}$`, 'i') } // Case insensitive
      });

      if (jobSearch) {
        // Update existing search
        jobSearch.avgSalary = aiData.average_salary;
        jobSearch.openPositions = aiData.open_positions;
        jobSearch.jobGrowth = aiData.job_growth_yoy;
        jobSearch.lastAccessed = new Date();
        jobSearch.searchedAt = new Date(); // Update search time
      } else {
        // Create new search
        jobSearch = new JobSearch({
          userId: req.user.userId,
          jobTitle: aiData.job_title || jobTitle.trim(),
          avgSalary: aiData.average_salary,
          openPositions: aiData.open_positions,
          jobGrowth: aiData.job_growth_yoy
        });
      }

      await jobSearch.save();

      console.log(`✅ Job search saved successfully: ${jobSearch.jobTitle}`);

      res.status(201).json({
        message: jobSearch.isNew !== false ? 'Job search created successfully' : 'Job search updated successfully',
        jobSearch,
        aiData // Include raw AI data for frontend processing
      });

    } catch (flaskError) {
      console.error('Flask AI service error:', flaskError.message);
      
      if (flaskError.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
          error: 'AI service is currently unavailable. Please make sure Flask server is running on port 5000.' 
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to fetch job insights from AI service',
        details: flaskError.message
      });
    }

  } catch (error) {
    console.error('Job search creation error:', error);
    res.status(500).json({ 
      error: 'Server error while processing job search',
      details: error.message 
    });
  }
});

// Delete job search
router.delete('/:id', auth, async (req, res) => {
  try {
    const jobSearch = await JobSearch.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!jobSearch) {
      return res.status(404).json({ error: 'Job search not found' });
    }

    res.json({ message: 'Job search deleted successfully' });
  } catch (error) {
    console.error('Delete job search error:', error);
    res.status(500).json({ error: 'Server error while deleting job search' });
  }
});

module.exports = router;