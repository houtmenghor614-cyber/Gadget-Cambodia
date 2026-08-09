import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { bannerService } from '../services/bannerService';
import { categoryService } from '../services/categoryService';
import BannerSlider from '../components/banners/BannerSlider';
import ProductList from '../components/products/ProductList';
import { FaArrowRight, FaMobile, FaLaptop, FaHeadphones, FaClock, FaGamepad, FaCamera, FaTablet, FaTv } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data...');
        
        // Fetch all data in parallel
        const [productsData, bannersData, categoriesData] = await Promise.all([
          productService.getFeaturedProducts(8),
          bannerService.getBanners(),
          categoryService.getCategories(),
        ]);
        
        console.log('Featured Products Response:', productsData);
        console.log('Banners Response:', bannersData);
        console.log('Categories Response:', categoriesData);
        
        setFeaturedProducts(productsData || []);
        setBanners(bannersData || []);
        setCategories(categoriesData || []);
        setError(null);
        
        // If no featured products, fetch regular products as fallback
        if (!productsData || productsData.length === 0) {
          console.log('No featured products found, fetching regular products...');
          const allProducts = await productService.getProducts({ limit: 8 });
          console.log('Regular products:', allProducts);
          setFeaturedProducts(allProducts || []);
        }
        
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load data. Please try again.');
        
        // Fallback: try to get regular products
        try {
          const allProducts = await productService.getProducts({ limit: 8 });
          setFeaturedProducts(allProducts || []);
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Category icons mapping
  const getCategoryIcon = (name) => {
    const iconMap = {
      'smartphones': <FaMobile className="w-8 h-8" />,
      'laptops': <FaLaptop className="w-8 h-8" />,
      'accessories': <FaHeadphones className="w-8 h-8" />,
      'watches': <FaClock className="w-8 h-8" />,
      'gaming': <FaGamepad className="w-8 h-8" />,
      'cameras': <FaCamera className="w-8 h-8" />,
      'tablets': <FaTablet className="w-8 h-8" />,
      'tvs': <FaTv className="w-8 h-8" />,
    };
    return iconMap[name?.toLowerCase()] || <FaMobile className="w-8 h-8" />;
  };

  // Category colors
  const getCategoryColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
    ];
    return colors[index % colors.length];
  };

  // Show loading state
  if (loading) {
    return (
      <div className="pt-20">
        <div className="container-custom py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no categories, show a message
  if (categories.length === 0) {
    return (
      <div className="pt-20">
        <BannerSlider banners={banners} loading={loading} />
        <div className="container-custom py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Categories Available</h2>
          <p className="text-gray-500 mt-2">Check back later for new categories!</p>
        </div>
        <section className="container-custom py-12">
          <ProductList
            products={featuredProducts}
            loading={loading}
            error={error}
            showCategory={true}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section with Banner Slider */}
      <section className="mb-12">
        <BannerSlider banners={banners} loading={loading} />
      </section>

      {/* Categories Section with Walk-Around Animation */}
      <section className="container-custom py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our wide range of products</p>
          </div>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-2"
          >
            <span>View All</span>
            <FaArrowRight />
          </Link>
        </div>

        {/* Walk-Around Categories - Horizontal Scroll with Animation */}
        <div className="relative overflow-hidden">
          <div className="flex space-x-6 animate-scroll hover:pause">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="flex-shrink-0 w-48 group"
              >
                <div className={`bg-gradient-to-br ${getCategoryColor(index)} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-all duration-300">
                      {getCategoryIcon(category.name)}
                    </div>
                    <h3 className="font-bold text-lg truncate w-full">{category.name}</h3>
                    <span className="text-xs opacity-75 mt-1">
                      {category.products?.length || 0} products
                    </span>
                    <div className="mt-3 w-8 h-0.5 bg-white/50 group-hover:w-12 transition-all duration-300"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products with Category Labels */}
      <section className="container-custom py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Check out our latest and greatest gadgets</p>
          </div>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-2"
          >
            <span>View All</span>
            <FaArrowRight />
          </Link>
        </div>

        <ProductList
          products={featuredProducts}
          loading={loading}
          error={error}
          showCategory={true}
        />

        {featuredProducts.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available</p>
            <p className="text-sm text-gray-400 mt-2">
              Mark products as "Featured" in the admin dashboard to show them here.
            </p>
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="container-custom py-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Summer Sale!
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Get up to 50% off on selected items. Limited time offer!
              </p>
              <Link
                to="/products"
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
              >
                Shop Now
              </Link>
            </div>
            <div className="hidden md:block text-right">
              <span className="text-6xl font-bold opacity-20">50%</span>
              <span className="text-2xl font-bold opacity-20 ml-2">OFF</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;