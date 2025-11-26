import express from 'express';
import ContentGenerator from '../utils/contentGenerator.js';

const router = express.Router();
const contentGenerator = new ContentGenerator();

/**
 * @route   POST /api/content/generate
 * @desc    Generate AI content
 * @access  Public
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      productName,
      category,
      features,
      audience,
      tone,
      contentType,
      sizeTableType,
      unitType
    } = req.body;

    if (!productName && contentType !== 'sizetable') {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    // Generate content using AI or templates
    const result = await contentGenerator.generateProductContent({
      productName,
      category,
      features,
      audience,
      tone: tone || 'professional',
      contentType: contentType || 'description',
      sizeTableType,
      unitType
    });

    res.json({
      success: true,
      content: result.content,
      source: result.source,
      model: result.model
    });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/content/size-table
 * @desc    Generate size table
 * @access  Public
 */
router.post('/size-table', async (req, res) => {
  try {
    const { tableType, unitType } = req.body;

    if (!tableType) {
      return res.status(400).json({
        success: false,
        message: 'Table type is required'
      });
    }

    const result = await contentGenerator.generateProductContent({
      contentType: 'sizetable',
      sizeTableType: tableType,
      unitType: unitType || 'inches'
    });

    res.json({
      success: true,
      content: result.content,
      tableType,
      unitType
    });
  } catch (error) {
    console.error('Size table generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/content/bulk-generate
 * @desc    Generate multiple content types at once
 * @access  Public
 */
router.post('/bulk-generate', async (req, res) => {
  try {
    const { productName, category, features, audience, tone, contentTypes } = req.body;

    if (!productName || !contentTypes || !Array.isArray(contentTypes)) {
      return res.status(400).json({
        success: false,
        message: 'Product name and content types array are required'
      });
    }

    const results = {};

    for (const contentType of contentTypes) {
      const result = await contentGenerator.generateProductContent({
        productName,
        category,
        features,
        audience,
        tone: tone || 'professional',
        contentType
      });

      results[contentType] = result.content;
    }

    res.json({
      success: true,
      results,
      count: Object.keys(results).length
    });
  } catch (error) {
    console.error('Bulk generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/content/templates
 * @desc    Get available content templates
 * @access  Public
 */
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    templates: {
      contentTypes: [
        { value: 'description', label: 'Product Description' },
        { value: 'title', label: 'Product Title' },
        { value: 'bullets', label: 'Bullet Points' },
        { value: 'seo', label: 'SEO Description' },
        { value: 'social', label: 'Social Media Post' },
        { value: 'email', label: 'Email Marketing' },
        { value: 'sizetable', label: 'Size Chart/Table' }
      ],
      tones: [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'luxury', label: 'Luxury' },
        { value: 'playful', label: 'Playful' },
        { value: 'urgent', label: 'Urgent' }
      ],
      sizeTableTypes: [
        { value: 'clothing', label: 'Clothing (S, M, L, XL)' },
        { value: 'shoes', label: 'Shoes (US/EU/UK)' },
        { value: 'kids', label: 'Kids Clothing (Age-based)' },
        { value: 'rings', label: 'Rings' },
        { value: 'international', label: 'International Sizing' }
      ]
    }
  });
});

export default router;
