import api from './api';

export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`/orders/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderNumber}:`, error);
      throw error;
    }
  }
};