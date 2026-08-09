// Image helper utility - Works with both local and production

// Get the base URL from environment or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
// Extract base URL (remove /api/v1 for static files)
const BASE_URL = API_URL.replace('/api/v1', '');

console.log('🔧 Image Helper Config:');
console.log('  API_URL:', API_URL);
console.log('  BASE_URL:', BASE_URL);

export const getImageUrl = (imagePath) => {
  console.log('Getting image URL for:', imagePath);
  
  if (!imagePath) {
    console.log('No image path provided, using placeholder');
    return 'https://via.placeholder.com/400x300/2563eb/FFFFFF?text=No+Image';
  }
  
  // If it's already a full URL (http or https)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('Full URL:', imagePath);
    return imagePath;
  }
  
  // If it starts with /static, use the base URL
  if (imagePath.startsWith('/static')) {
    const url = `${BASE_URL}${imagePath}`;
    console.log('Static URL:', url);
    return url;
  }
  
  // If it starts with static/ (no leading slash)
  if (imagePath.startsWith('static/')) {
    const url = `${BASE_URL}/${imagePath}`;
    console.log('Static URL (no slash):', url);
    return url;
  }
  
  // If it's just a filename (no path)
  if (!imagePath.includes('/')) {
    const url = `${BASE_URL}/static/images/products/${imagePath}`;
    console.log('Filename URL:', url);
    return url;
  }
  
  // Fallback: try to construct URL
  const url = `${BASE_URL}/${imagePath}`;
  console.log('Fallback URL:', url);
  return url;
};

export const getProductImage = (imagePath) => {
  console.log('Getting product image:', imagePath);
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300/2563eb/FFFFFF?text=Product';
  }
  return getImageUrl(imagePath);
};

export const getBannerImage = (imagePath) => {
  console.log('Getting banner image:', imagePath);
  if (!imagePath) {
    return 'https://via.placeholder.com/1200x400/2563eb/FFFFFF?text=Gadget+Cambodia';
  }
  
  // If it's already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /static
  if (imagePath.startsWith('/static')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // If it starts with static/
  if (imagePath.startsWith('static/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  // If it's just a filename
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

// Create the imageHelper object
const imageHelper = {
  getImageUrl,
  getProductImage,
  getBannerImage,
  getCategoryImage,
};

// Export as default
export default imageHelper;