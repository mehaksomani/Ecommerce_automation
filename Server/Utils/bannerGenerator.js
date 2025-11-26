import { createCanvas, loadImage, registerFont } from 'canvas';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Banner Generator using node-canvas (100% Free)
 * Creates marketing banners programmatically
 */

class BannerGenerator {
  constructor() {
    this.defaultWidth = 1200;
    this.defaultHeight = 400;
  }

  /**
   * Generate marketing banner
   */
  async generateBanner(options) {
    const {
      templateType = 'sale',
      mainText = 'SUMMER SALE',
      subtext = 'Up to 50% OFF',
      ctaText = 'Shop Now',
      colors = {
        background: '#667eea',
        text: '#ffffff',
        accent: '#ffd700'
      },
      width = this.defaultWidth,
      height = this.defaultHeight
    } = options;

    try {
      // Create canvas
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, colors.background);
      gradient.addColorStop(1, colors.accent);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add decorative elements based on template type
      this.addDecorativeElements(ctx, templateType, width, height, colors);

      // Draw main text
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 80px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(mainText, width / 2, height / 3);

      // Draw subtext
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.fillText(subtext, width / 2, height / 2);

      // Draw CTA button
      const buttonWidth = 250;
      const buttonHeight = 60;
      const buttonX = (width - buttonWidth) / 2;
      const buttonY = height - 100;

      // Button shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      // Button background
      ctx.fillStyle = colors.text;
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

      // Reset shadow
      ctx.shadowColor = 'transparent';

      // Button text
      ctx.fillStyle = colors.background;
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillText(ctaText, width / 2, buttonY + buttonHeight / 2);

      // Convert canvas to buffer
      const buffer = canvas.toBuffer('image/png');

      return {
        success: true,
        buffer,
        dimensions: { width, height }
      };
    } catch (error) {
      throw new Error(`Failed to generate banner: ${error.message}`);
    }
  }

  /**
   * Add decorative elements based on template type
   */
  addDecorativeElements(ctx, templateType, width, height, colors) {
    ctx.save();

    switch (templateType) {
      case 'sale':
        // Add sale tag elements
        this.drawSaleElements(ctx, width, height, colors);
        break;
      case 'new':
        // Add new arrival stars
        this.drawStars(ctx, width, height, colors);
        break;
      case 'collection':
        // Add elegant frames
        this.drawFrames(ctx, width, height, colors);
        break;
      case 'seasonal':
        // Add seasonal decorations
        this.drawSeasonalElements(ctx, width, height, colors);
        break;
    }

    ctx.restore();
  }

  drawSaleElements(ctx, width, height, colors) {
    // Draw percentage symbols
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = 'bold 120px Arial';
    ctx.fillText('%', width * 0.15, height * 0.3);
    ctx.fillText('%', width * 0.85, height * 0.7);
  }

  drawStars(ctx, width, height, colors) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    const starPositions = [
      [width * 0.1, height * 0.2],
      [width * 0.9, height * 0.3],
      [width * 0.15, height * 0.8],
      [width * 0.85, height * 0.85]
    ];

    starPositions.forEach(([x, y]) => {
      this.drawStar(ctx, x, y, 5, 30, 15);
    });
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  drawFrames(ctx, width, height, colors) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }

  drawSeasonalElements(ctx, width, height, colors) {
    // Draw snowflakes or leaves
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 20 + 5;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Generate catalogue page
   */
  async generateCatalogue(options) {
    const {
      title = 'Product Catalogue',
      brand = 'Your Brand',
      products = [],
      colors = {
        primary: '#2c3e50',
        secondary: '#ffffff',
        accent: '#3498db'
      },
      width = 800,
      height = 1000
    } = options;

    try {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(0, 0, width, height);

      // Header
      ctx.fillStyle = colors.primary;
      ctx.fillRect(0, 0, width, 200);

      // Brand name
      ctx.fillStyle = colors.secondary;
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(brand, width / 2, 80);

      // Title
      ctx.font = '32px Arial';
      ctx.fillText(title, width / 2, 150);

      // Product grid
      const cols = 3;
      const rows = 2;
      const boxSize = 200;
      const spacing = 30;
      const startX = (width - (cols * boxSize + (cols - 1) * spacing)) / 2;
      const startY = 250;

      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.fillStyle = colors.secondary;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = startX + i * (boxSize + spacing);
          const y = startY + j * (boxSize + spacing);
          
          ctx.fillRect(x, y, boxSize, boxSize);
          ctx.strokeRect(x, y, boxSize, boxSize);
          
          // Product placeholder
          ctx.fillStyle = colors.primary;
          ctx.font = '16px Arial';
          ctx.fillText(`Product ${i + j * cols + 1}`, x + boxSize / 2, y + boxSize / 2);
        }
      }

      const buffer = canvas.toBuffer('image/png');

      return {
        success: true,
        buffer,
        dimensions: { width, height }
      };
    } catch (error) {
      throw new Error(`Failed to generate catalogue: ${error.message}`);
    }
  }

  /**
   * Save banner to file
   */
  async saveBanner(buffer, outputPath) {
    try {
      await fs.writeFile(outputPath, buffer);
      return {
        success: true,
        path: outputPath
      };
    } catch (error) {
      throw new Error(`Failed to save banner: ${error.message}`);
    }
  }
}

export default BannerGenerator;
