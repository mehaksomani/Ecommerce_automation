import express from 'express';
import ContentGenerator from '../utils/contentGenerator.js';
import Project from '../models/Project.js';

const router = express.Router();
const contentGenerator = new ContentGenerator();

/**
 * @route   POST /api/content/generate
 * @desc    Generate AI content and save to database
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
      unitType,
      projectId  // ✅ NEW: Accept projectId from frontend
    } = req.body;

    // Validation
    if (!productName && contentType !== 'sizetable') {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    console.log('📝 Generating content for:', productName);

    // ✅ STEP 1: Generate content using AI or templates
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

    console.log('✅ Content generated successfully. Source:', result.source);

    // ✅ STEP 2: Save to database
    let project;
    
    if (projectId) {
      // Try to find existing project
      project = await Project.findById(projectId);
      
      if (!project) {
        console.log('⚠️ Project not found, creating new one');
        project = new Project({
          name: `Content for ${productName}`,
          type: 'content',
          images: [],
          content: [],
          banners: [],
          stats: {
            imagesEnhanced: 0,
            contentGenerated: 0,
            bannersCreated: 0
          }
        });
      } else {
        console.log('✅ Found existing project:', project.name);
      }
    } else {
      // Create new project
      console.log('📁 Creating new project');
      project = new Project({
        name: `Content for ${productName}`,
        type: 'content',
        images: [],
        content: [],
        banners: [],
        stats: {
          imagesEnhanced: 0,
          contentGenerated: 0,
          bannersCreated: 0
        }
      });
    }

    // ✅ STEP 3: Add content to project
    project.content.push({
      productName: productName || 'Size Table',
      category: category || '',
      features: features || '',
      audience: audience || '',
      tone: tone || 'professional',
      contentType: contentType || 'description',
      generatedContent: result.content,
      createdAt: new Date()
    });

    // ✅ STEP 4: Update statistics
    project.stats.contentGenerated = (project.stats.contentGenerated || 0) + 1;
    project.updatedAt = new Date();

    // ✅ STEP 5: Save to MongoDB
    await project.save();
    console.log('💾 Content saved to database. Project ID:', project._id);

    // ✅ STEP 6: Return response
    res.json({
      success: true,
      content: result.content,
      source: result.source,
      model: result.model,
      projectId: project._id.toString(),
      message: 'Content generated and saved to database successfully',
      stats: {
        totalContent: project.content.length,
        contentGenerated: project.stats.contentGenerated
      }
    });

  } catch (error) {
    console.error('❌ Content generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   POST /api/content/size-table
 * @desc    Generate size table and save to database
 * @access  Public
 */
router.post('/size-table', async (req, res) => {
  try {
    const { tableType, unitType, projectId } = req.body;

    if (!tableType) {
      return res.status(400).json({
        success: false,
        message: 'Table type is required'
      });
    }

    console.log('📏 Generating size table:', tableType);

    // Generate size table
    const result = await contentGenerator.generateProductContent({
      contentType: 'sizetable',
      sizeTableType: tableType,
      unitType: unitType || 'inches'
    });

    // Save to database
    let project;
    
    if (projectId) {
      project = await Project.findById(projectId);
    }
    
    if (!project) {
      project = new Project({
        name: `Size Table - ${tableType}`,
        type: 'content',
        images: [],
        content: [],
        banners: [],
        stats: {
          imagesEnhanced: 0,
          contentGenerated: 0,
          bannersCreated: 0
        }
      });
    }

    project.content.push({
      productName: `Size Table - ${tableType}`,
      category: 'size-table',
      contentType: 'sizetable',
      generatedContent: result.content,
      createdAt: new Date()
    });

    project.stats.contentGenerated = (project.stats.contentGenerated || 0) + 1;
    project.updatedAt = new Date();
    await project.save();

    console.log('✅ Size table saved to database');

    res.json({
      success: true,
      content: result.content,
      tableType,
      unitType,
      projectId: project._id.toString(),
      message: 'Size table generated and saved successfully'
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
 * @desc    Generate multiple content types at once and save to database
 * @access  Public
 */
router.post('/bulk-generate', async (req, res) => {
  try {
    const { productName, category, features, audience, tone, contentTypes, projectId } = req.body;

    if (!productName || !contentTypes || !Array.isArray(contentTypes)) {
      return res.status(400).json({
        success: false,
        message: 'Product name and content types array are required'
      });
    }

    console.log('📦 Bulk generating', contentTypes.length, 'content types');

    const results = {};

    // Generate all content types
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

    // Save to database
    let project;
    
    if (projectId) {
      project = await Project.findById(projectId);
    }
    
    if (!project) {
      project = new Project({
        name: `Bulk Content for ${productName}`,
        type: 'content',
        images: [],
        content: [],
        banners: [],
        stats: {
          imagesEnhanced: 0,
          contentGenerated: 0,
          bannersCreated: 0
        }
      });
    }

    // Add all generated content to project
    for (const contentType of contentTypes) {
      project.content.push({
        productName,
        category: category || '',
        features: features || '',
        audience: audience || '',
        tone: tone || 'professional',
        contentType,
        generatedContent: results[contentType],
        createdAt: new Date()
      });
    }

    project.stats.contentGenerated = (project.stats.contentGenerated || 0) + contentTypes.length;
    project.updatedAt = new Date();
    await project.save();

    console.log('✅ Bulk content saved to database');

    res.json({
      success: true,
      results,
      count: Object.keys(results).length,
      projectId: project._id.toString(),
      message: 'Bulk content generated and saved successfully'
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