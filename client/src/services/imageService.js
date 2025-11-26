import api from './api';

/**
 * Image Service
 * Handles all image-related API calls
 */

const imageService = {
  /**
   * Upload images
   * @param {FormData} formData - Form data containing images
   * @returns {Promise} Response with uploaded file info
   */
  upload: async (formData) => {
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Enhance image
   * @param {string} filename - Image filename
   * @param {object} enhancements - Enhancement parameters
   * @returns {Promise} Response with enhanced image path
   */
  enhance: async (filename, enhancements) => {
    const response = await api.post('/images/enhance', {
      filename,
      enhancements,
    });
    return response.data;
  },

  /**
   * Remove background from image
   * @param {string} filename - Image filename
   * @returns {Promise} Response with processed image path
   */
  removeBackground: async (filename) => {
    const response = await api.post('/images/remove-background', {
      filename,
    });
    return response.data;
  },

  /**
   * Resize image
   * @param {string} filename - Image filename
   * @param {number} width - Target width
   * @param {number} height - Target height
   * @param {number} quality - Image quality (1-100)
   * @returns {Promise} Response with resized image path
   */
  resize: async (filename, width, height, quality = 90) => {
    const response = await api.post('/images/resize', {
      filename,
      width,
      height,
      quality,
    });
    return response.data;
  },

  /**
   * Apply filter to image
   * @param {string} filename - Image filename
   * @param {string} filterType - Filter type (grayscale, sepia, blur, negative)
   * @returns {Promise} Response with filtered image path
   */
  applyFilter: async (filename, filterType) => {
    const response = await api.post('/images/filter', {
      filename,
      filterType,
    });
    return response.data;
  },

  /**
   * Get image metadata
   * @param {string} filename - Image filename
   * @returns {Promise} Response with image metadata
   */
  getMetadata: async (filename) => {
    const response = await api.get(`/images/metadata/${filename}`);
    return response.data;
  },
};

export default imageService;
