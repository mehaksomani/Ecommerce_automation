import api from './api';

/**
 * Content Service
 * Handles all content generation API calls
 */

const contentService = {
  /**
   * Generate AI content
   * @param {object} params - Content generation parameters
   * @returns {Promise} Response with generated content
   */
  generate: async (params) => {
    const response = await api.post('/content/generate', params);
    return response.data;
  },

  /**
   * Generate size table
   * @param {string} tableType - Type of size table
   * @param {string} unitType - Measurement unit
   * @returns {Promise} Response with size table HTML
   */
  generateSizeTable: async (tableType, unitType) => {
    const response = await api.post('/content/size-table', {
      tableType,
      unitType,
    });
    return response.data;
  },

  /**
   * Generate multiple content types at once
   * @param {object} params - Content parameters
   * @param {array} contentTypes - Array of content types to generate
   * @returns {Promise} Response with multiple generated contents
   */
  bulkGenerate: async (params, contentTypes) => {
    const response = await api.post('/content/bulk-generate', {
      ...params,
      contentTypes,
    });
    return response.data;
  },

  /**
   * Get available content templates
   * @returns {Promise} Response with template options
   */
  getTemplates: async () => {
    const response = await api.get('/content/templates');
    return response.data;
  },
};

export default contentService;
