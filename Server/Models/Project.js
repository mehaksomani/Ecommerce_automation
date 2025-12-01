import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['image', 'content', 'banner', 'catalogue', 'mixed'],
    required: true
  },
  images: [{
    originalName: String,
    path: String,
    enhancedPath: String,
    enhancements: {
      brightness: Number,
      contrast: Number,
      saturation: Number,
      sharpness: Number
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  content: [{
    productName: String,
    category: String,
    features: String,
    audience: String,
    tone: String,
    contentType: String,
    generatedContent: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  banners: [{
    templateType: String,
    mainText: String,
    subtext: String,
    ctaText: String,
    colors: {
      background: String,
      text: String,
      accent: String
    },
    imagePath: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    imagesEnhanced: {
      type: Number,
      default: 0
    },
    contentGenerated: {
      type: Number,
      default: 0
    },
    bannersCreated: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;