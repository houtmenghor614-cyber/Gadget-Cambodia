// Image helper utility - Works with both local and production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300/2563eb/FFFFFF?text=No+Image';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/static')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  if (imagePath.startsWith('static/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  if (!imagePath.includes('/')) {
    return `${BASE_URL}/static/images/products/${imagePath}`;
  }
  
  return `${BASE_URL}/${imagePath}`;
};

export const getProductImage = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300/2563eb/FFFFFF?text=Product';
  }
  return getImageUrl(imagePath);
};

export const getBannerImage = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/1200x400/2563eb/FFFFFF?text=Gadget+Cambodia';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/static')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  if (imagePath.startsWith('static/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  if (!imagePath.includes('/')) {
    return `${BASE_URL}/static/images/banners/${imagePath}`;
  }
  
  return `${BASE_URL}/${imagePath}`;
};

export const getCategoryImage = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/100x100/7c3aed/FFFFFF?text=Category';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/static')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  if (imagePath.startsWith('static/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  if (!imagePath.includes('/')) {
    return `${BASE_URL}/static/images/categories/${imagePath}`;
  }
  
  return `${BASE_URL}/${imagePath}`;
};

// Export as default with named exports
const imageHelper = {
  getImageUrl,
  getProductImage,
  getBannerImage,
  getCategoryImage,
};

export default imageHelper;