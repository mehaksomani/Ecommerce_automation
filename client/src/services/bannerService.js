import api from './api';

/**
 * Banner Service
 * Handles all banner and catalogue generation API calls
 */

const bannerService = {
  /**
   * Generate marketing banner
   * @param {object} params - Banner parameters
   * @returns {Promise} Response with banner image path
   */
  generate: async (params) => {
    const response = await api.post('/banners/generate', params);
    return response.data;
  },

  /**
   * Generate catalogue page
   * @param {object} params - Catalogue parameters
   * @returns {Promise} Response with catalogue image path
   */
  generateCatalogue: async (params) => {
    const response = await api.post('/banners/catalogue', params);
    return response.data;
  },

  /**
   * Get available banner templates
   * @returns {Promise} Response with template options
   */
  getTemplates: async () => {
    const response = await api.get('/banners/templates');
    return response.data;
  },
};

export default bannerService;
