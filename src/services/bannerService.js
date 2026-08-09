import api from './api';

export const bannerService = {
  // Get active banners
  getBanners: async () => {
    try {
      const response = await api.get('/banners');
      return response.data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  }
};