import api from './api';

/**
 * Project Service
 * Handles all project management API calls
 */

const projectService = {
  /**
   * Get all projects
   * @returns {Promise} Response with list of projects
   */
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  /**
   * Get project by ID
   * @param {string} id - Project ID
   * @returns {Promise} Response with project details
   */
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Create new project
   * @param {object} projectData - Project data
   * @returns {Promise} Response with created project
   */
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  /**
   * Update project
   * @param {string} id - Project ID
   * @param {object} updates - Updated project data
   * @returns {Promise} Response with updated project
   */
  update: async (id, updates) => {
    const response = await api.put(`/projects/${id}`, updates);
    return response.data;
  },

  /**
   * Delete project
   * @param {string} id - Project ID
   * @returns {Promise} Response confirming deletion
   */
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  /**
   * Add image to project
   * @param {string} id - Project ID
   * @param {object} imageData - Image data
   * @returns {Promise} Response with updated project
   */
  addImage: async (id, imageData) => {
    const response = await api.post(`/projects/${id}/image`, imageData);
    return response.data;
  },

  /**
   * Add content to project
   * @param {string} id - Project ID
   * @param {object} contentData - Content data
   * @returns {Promise} Response with updated project
   */
  addContent: async (id, contentData) => {
    const response = await api.post(`/projects/${id}/content`, contentData);
    return response.data;
  },

  /**
   * Add banner to project
   * @param {string} id - Project ID
   * @param {object} bannerData - Banner data
   * @returns {Promise} Response with updated project
   */
  addBanner: async (id, bannerData) => {
    const response = await api.post(`/projects/${id}/banner`, bannerData);
    return response.data;
  },

  /**
   * Get project statistics
   * @param {string} id - Project ID
   * @returns {Promise} Response with project stats
   */
  getStats: async (id) => {
    const response = await api.get(`/projects/${id}/stats`);
    return response.data;
  },
};

export default projectService;
