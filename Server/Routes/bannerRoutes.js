import express from 'express';
import BannerGenerator from '../utils/bannerGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const bannerGenerator = new BannerGenerator();

/**
 * @route   POST /api/banners/generate
 * @desc    Generate marketing banner
 * @access  Public
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      templateType,
      mainText,
      subtext,
      ctaText,
      colors,
      width,
      height
    } = req.body;

    if (!mainText) {
      return res.status(400).json({
        success: false,
        message: 'Main text is required'
      });
    }

    // Generate banner
    const result = await bannerGenerator.generateBanner({
      templateType: templateType || 'sale',
      mainText,
      subtext,
      ctaText,
      colors,
      width: parseInt(width) || 1200,
      height: parseInt(height) || 400
    });

    // Save banner
    const bannersPath = path.join(__dirname, '../uploads/banners');
    await fs.mkdir(bannersPath, { recursive: true });

    const filename = `banner-${Date.now()}.png`;
    const filepath = path.join(bannersPath, filename);

    await bannerGenerator.saveBanner(result.buffer, filepath);

    res.json({
      success: true,
      message: 'Banner generated successfully',
      path: `/uploads/banners/${filename}`,
      dimensions: result.dimensions
    });
  } catch (error) {
    console.error('Banner generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/banners/catalogue
 * @desc    Generate catalogue page
 * @access  Public
 */
router.post('/catalogue', async (req, res) => {
  try {
    const {
      title,
      brand,
      products,
      colors,
      width,
      height
    } = req.body;

    if (!title || !brand) {
      return res.status(400).json({
        success: false,
        message: 'Title and brand are required'
      });
    }

    // Generate catalogue
    const result = await bannerGenerator.generateCatalogue({
      title,
      brand,
      products: products || [],
      colors,
      width: parseInt(width) || 800,
      height: parseInt(height) || 1000
    });

    // Save catalogue
    const cataloguesPath = path.join(__dirname, '../uploads/catalogues');
    await fs.mkdir(cataloguesPath, { recursive: true });

    const filename = `catalogue-${Date.now()}.png`;
    const filepath = path.join(cataloguesPath, filename);

    await bannerGenerator.saveBanner(result.buffer, filepath);

    res.json({
      success: true,
      message: 'Catalogue generated successfully',
      path: `/uploads/catalogues/${filename}`,
      dimensions: result.dimensions
    });
  } catch (error) {
    console.error('Catalogue generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/banners/templates
 * @desc    Get available banner templates
 * @access  Public
 */
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    templates: [
      {
        type: 'sale',
        name: 'Flash Sale Banner',
        description: 'Perfect for time-limited offers',
        defaultColors: {
          background: '#ff6b6b',
          text: '#ffffff',
          accent: '#ee5a6f'
        }
      },
      {
        type: 'new',
        name: 'New Arrival Banner',
        description: 'Showcase latest products',
        defaultColors: {
          background: '#4facfe',
          text: '#ffffff',
          accent: '#00f2fe'
        }
      },
      {
        type: 'collection',
        name: 'Collection Banner',
        description: 'Highlight product collections',
        defaultColors: {
          background: '#f093fb',
          text: '#ffffff',
          accent: '#f5576c'
        }
      },
      {
        type: 'seasonal',
        name: 'Seasonal Banner',
        description: 'Holiday & seasonal promotions',
        defaultColors: {
          background: '#ffecd2',
          text: '#333333',
          accent: '#fcb69f'
        }
      }
    ]
  });
});

export default router;
