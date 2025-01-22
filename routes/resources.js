const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const validate = require('../middleware/validation');
const { resourceSchema } = require('../utils/validation-schemas');

// Create resource (Admin only)
router.post(
  '/create',
  auth,
  checkRole(['admin']),
  validate(resourceSchema),
  async (req, res) => {
    try {
      const resource = await Resource.create({
        ...req.body,
        createdBy: req.user._id
      });

      res.status(201).json({
        success: true,
        data: resource
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Get all resources
router.get('/all', auth, async (req, res) => {
  try {
    const resources = await Resource.find().populate('createdBy', 'name email');
    
    res.json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get resource by ID
router.get('/byId/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update resource (Admin only)
router.put(
  '/update/:id',
  auth,
  checkRole(['admin']),
  validate(resourceSchema),
  async (req, res) => {
    try {
      const resource = await Resource.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      res.json({
        success: true,
        data: resource
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Delete resource (Admin only)
router.delete(
  '/delete/:id',
  auth,
  checkRole(['admin']),
  async (req, res) => {
    try {
      const resource = await Resource.findByIdAndDelete(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      res.json({
        success: true,
        message: 'Resource deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

module.exports = router;