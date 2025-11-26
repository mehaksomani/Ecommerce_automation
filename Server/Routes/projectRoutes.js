import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Project name and type are required'
      });
    }

    const project = new Project({
      name,
      type,
      images: [],
      content: [],
      banners: [],
      stats: {
        imagesEnhanced: 0,
        contentGenerated: 0,
        bannersCreated: 0
      }
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update fields
    if (req.body.name) project.name = req.body.name;
    if (req.body.images) project.images = req.body.images;
    if (req.body.content) project.content = req.body.content;
    if (req.body.banners) project.banners = req.body.banners;
    if (req.body.stats) project.stats = req.body.stats;

    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/image
 * @desc    Add image to project
 * @access  Public
 */
router.post('/:id/image', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const imageData = req.body;
    project.images.push(imageData);
    project.stats.imagesEnhanced += 1;

    await project.save();

    res.json({
      success: true,
      message: 'Image added to project',
      project
    });
  } catch (error) {
    console.error('Add image error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/content
 * @desc    Add content to project
 * @access  Public
 */
router.post('/:id/content', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const contentData = req.body;
    project.content.push(contentData);
    project.stats.contentGenerated += 1;

    await project.save();

    res.json({
      success: true,
      message: 'Content added to project',
      project
    });
  } catch (error) {
    console.error('Add content error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/banner
 * @desc    Add banner to project
 * @access  Public
 */
router.post('/:id/banner', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const bannerData = req.body;
    project.banners.push(bannerData);
    project.stats.bannersCreated += 1;

    await project.save();

    res.json({
      success: true,
      message: 'Banner added to project',
      project
    });
  } catch (error) {
    console.error('Add banner error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/stats
 * @desc    Get project statistics
 * @access  Public
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      stats: project.stats,
      totals: {
        images: project.images.length,
        content: project.content.length,
        banners: project.banners.length
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
