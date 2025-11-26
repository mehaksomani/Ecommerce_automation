import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ImageEnhancer from '../utils/imageEnhancer.js';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/original');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

/**
 * @route   POST /api/images/upload
 * @desc    Upload images
 * @access  Public
 */
router.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: `/uploads/original/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/images/enhance
 * @desc    Enhance image
 * @access  Public
 */
router.post('/enhance', async (req, res) => {
  try {
    const { filename, enhancements } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const inputPath = path.join(__dirname, '../uploads/original', filename);
    const enhancedPath = path.join(__dirname, '../uploads/enhanced');
    
    // Create enhanced directory if it doesn't exist
    await fs.mkdir(enhancedPath, { recursive: true });

    const outputFilename = `enhanced-${filename}`;
    const outputPath = path.join(enhancedPath, outputFilename);

    // Apply enhancements
    const result = await ImageEnhancer.enhanceImage(inputPath, outputPath, {
      brightness: parseFloat(enhancements?.brightness || 1),
      contrast: parseFloat(enhancements?.contrast || 1),
      saturation: parseFloat(enhancements?.saturation || 1),
      sharpness: parseFloat(enhancements?.sharpness || 0)
    });

    res.json({
      success: true,
      message: 'Image enhanced successfully',
      enhancedPath: `/uploads/enhanced/${outputFilename}`,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/images/remove-background
 * @desc    Remove image background
 * @access  Public
 */
router.post('/remove-background', async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const inputPath = path.join(__dirname, '../uploads/original', filename);
    const outputPath = path.join(__dirname, '../uploads/enhanced', `nobg-${filename}`);

    const result = await ImageEnhancer.removeBackground(inputPath, outputPath);

    res.json({
      success: true,
      message: 'Background removed successfully',
      path: `/uploads/enhanced/nobg-${filename}`
    });
  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/images/resize
 * @desc    Resize image
 * @access  Public
 */
router.post('/resize', async (req, res) => {
  try {
    const { filename, width, height, quality } = req.body;

    if (!filename || !width || !height) {
      return res.status(400).json({
        success: false,
        message: 'Filename, width, and height are required'
      });
    }

    const inputPath = path.join(__dirname, '../uploads/original', filename);
    const outputPath = path.join(__dirname, '../uploads/enhanced', `resized-${filename}`);

    const result = await ImageEnhancer.resizeImage(
      inputPath,
      outputPath,
      parseInt(width),
      parseInt(height),
      { quality: parseInt(quality) || 90 }
    );

    res.json({
      success: true,
      message: 'Image resized successfully',
      path: `/uploads/enhanced/resized-${filename}`,
      dimensions: result.dimensions
    });
  } catch (error) {
    console.error('Resize error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/images/filter
 * @desc    Apply filter to image
 * @access  Public
 */
router.post('/filter', async (req, res) => {
  try {
    const { filename, filterType } = req.body;

    if (!filename || !filterType) {
      return res.status(400).json({
        success: false,
        message: 'Filename and filter type are required'
      });
    }

    const inputPath = path.join(__dirname, '../uploads/original', filename);
    const outputPath = path.join(__dirname, '../uploads/enhanced', `${filterType}-${filename}`);

    const result = await ImageEnhancer.applyFilter(inputPath, outputPath, filterType);

    res.json({
      success: true,
      message: 'Filter applied successfully',
      path: `/uploads/enhanced/${filterType}-${filename}`,
      filter: filterType
    });
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/images/metadata/:filename
 * @desc    Get image metadata
 * @access  Public
 */
router.get('/metadata/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '../uploads/original', filename);

    const result = await ImageEnhancer.getMetadata(imagePath);

    res.json(result);
  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
