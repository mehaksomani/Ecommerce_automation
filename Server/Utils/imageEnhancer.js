import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Image Enhancement Utilities using Sharp (100% Free)
 * Sharp is a high-performance Node.js image processing library
 */

class ImageEnhancer {
  /**
   * Apply enhancements to an image
   */
  static async enhanceImage(inputPath, outputPath, enhancements = {}) {
    try {
      const {
        brightness = 1,
        contrast = 1,
        saturation = 1,
        sharpness = 0
      } = enhancements;

      let image = sharp(inputPath);

      // Get image metadata
      const metadata = await image.metadata();

      // Apply brightness and contrast
      if (brightness !== 1 || contrast !== 1) {
        const brightnessMultiplier = brightness;
        const contrastMultiplier = contrast;
        
        image = image.modulate({
          brightness: brightnessMultiplier,
          saturation: saturation
        });
        
        // Apply contrast using linear transformation
        if (contrast !== 1) {
          image = image.linear(contrastMultiplier, -(128 * contrastMultiplier) + 128);
        }
      }

      // Apply sharpening
      if (sharpness > 0) {
        image = image.sharpen({
          sigma: sharpness / 10,
          m1: 0.5,
          m2: 3,
          x1: 2,
          y2: 10,
          y3: 20
        });
      }

      // Save the enhanced image
      await image.toFile(outputPath);

      return {
        success: true,
        outputPath,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format
        }
      };
    } catch (error) {
      console.error('Image enhancement error:', error);
      throw new Error(`Failed to enhance image: ${error.message}`);
    }
  }

  /**
   * Remove background from image (simple version)
   * Note: For production, consider using remove.bg API or rembg Python library
   */
  static async removeBackground(inputPath, outputPath) {
    try {
      // This is a simplified version
      // For better results, integrate with remove.bg API or use AI models
      const image = sharp(inputPath);
      
      // Apply a simple threshold-based background removal
      await image
        .threshold(240) // Simple white background removal
        .toFile(outputPath);

      return {
        success: true,
        outputPath,
        message: 'Basic background removal applied. For better results, consider using remove.bg API.'
      };
    } catch (error) {
      throw new Error(`Failed to remove background: ${error.message}`);
    }
  }

  /**
   * Resize image
   */
  static async resizeImage(inputPath, outputPath, width, height, options = {}) {
    try {
      const { fit = 'cover', quality = 90 } = options;

      await sharp(inputPath)
        .resize(width, height, { fit })
        .jpeg({ quality })
        .toFile(outputPath);

      return {
        success: true,
        outputPath,
        dimensions: { width, height }
      };
    } catch (error) {
      throw new Error(`Failed to resize image: ${error.message}`);
    }
  }

  /**
   * Convert image format
   */
  static async convertFormat(inputPath, outputPath, format = 'jpeg') {
    try {
      const image = sharp(inputPath);

      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          await image.jpeg({ quality: 90 }).toFile(outputPath);
          break;
        case 'png':
          await image.png({ quality: 90 }).toFile(outputPath);
          break;
        case 'webp':
          await image.webp({ quality: 90 }).toFile(outputPath);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      return {
        success: true,
        outputPath,
        format
      };
    } catch (error) {
      throw new Error(`Failed to convert format: ${error.message}`);
    }
  }

  /**
   * Apply filters
   */
  static async applyFilter(inputPath, outputPath, filterType) {
    try {
      let image = sharp(inputPath);

      switch (filterType) {
        case 'grayscale':
          image = image.grayscale();
          break;
        case 'sepia':
          image = image.tint({ r: 112, g: 66, b: 20 });
          break;
        case 'blur':
          image = image.blur(5);
          break;
        case 'negative':
          image = image.negate();
          break;
        default:
          throw new Error(`Unknown filter: ${filterType}`);
      }

      await image.toFile(outputPath);

      return {
        success: true,
        outputPath,
        filter: filterType
      };
    } catch (error) {
      throw new Error(`Failed to apply filter: ${error.message}`);
    }
  }

  /**
   * Optimize image for web
   */
  static async optimizeForWeb(inputPath, outputPath) {
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Resize if too large
      if (metadata.width > 2000) {
        image.resize(2000, null, { withoutEnlargement: true });
      }

      // Optimize based on format
      if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
        await image.jpeg({ quality: 85, progressive: true }).toFile(outputPath);
      } else if (metadata.format === 'png') {
        await image.png({ quality: 85, compressionLevel: 9 }).toFile(outputPath);
      } else {
        await image.webp({ quality: 85 }).toFile(outputPath);
      }

      return {
        success: true,
        outputPath,
        optimized: true
      };
    } catch (error) {
      throw new Error(`Failed to optimize image: ${error.message}`);
    }
  }

  /**
   * Get image metadata
   */
  static async getMetadata(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return {
        success: true,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: metadata.size,
          space: metadata.space,
          channels: metadata.channels,
          depth: metadata.depth,
          density: metadata.density,
          hasAlpha: metadata.hasAlpha
        }
      };
    } catch (error) {
      throw new Error(`Failed to get metadata: ${error.message}`);
    }
  }
}

export default ImageEnhancer;
