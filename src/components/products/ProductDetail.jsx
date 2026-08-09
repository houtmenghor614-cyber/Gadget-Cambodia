import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTelegram } from '../../hooks/useTelegram';
import { productService } from '../../services/productService';
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaTelegram, FaMinus, FaPlus, FaArrowLeft, FaHeart, FaShare } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { sendProductInquiry } = useTelegram();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isInquiring, setIsInquiring] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stock_quantity || 10));
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stock_quantity <= 0) {
      toast.error('Product is out of stock!');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product, quantity);
      toast.success(`Added ${quantity} ${product.name} to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSendToTelegram = async () => {
    if (!product) return;
    
    setIsInquiring(true);
    try {
      const userInfo = {
        name: 'Customer',
        phone: 'N/A',
        email: 'N/A'
      };
      
      await sendProductInquiry(product, userInfo);
      toast.success('Inquiry sent to Telegram!');
    } catch (error) {
      toast.error('Failed to send inquiry');
    } finally {
      setIsInquiring(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Gadget Cambodia!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (loading) {
    return (
      <div className="pt-20 container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20 container-custom py-12">
        <ErrorMessage 
          message={error || 'Product not found'} 
          onRetry={() => window.location.reload()}
        />
        <div className="text-center mt-4">
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const { name, price, description, image_url, stock_quantity, category } = product;
  const rating = 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Mock additional images
  const images = [
    image_url || 'https://via.placeholder.com/600x400?text=No+Image',
    image_url || 'https://via.placeholder.com/600x400?text=No+Image',
    image_url || 'https://via.placeholder.com/600x400?text=No+Image',
  ];

  return (
    <div className="pt-20 container-custom py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center space-x-2">
          <li>
            <button onClick={() => navigate('/')} className="hover:text-primary-600">
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button onClick={() => navigate('/products')} className="hover:text-primary-600">
              Products
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate">{name}</li>
        </ol>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="relative bg-gray-100 rounded-xl overflow-hidden h-96">
              <img
                src={images[selectedImage]}
                alt={name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
              {stock_quantity <= 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Out of Stock
                </div>
              )}
              {stock_quantity > 0 && stock_quantity < 10 && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Only {stock_quantity} left
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden h-20 border-2 transition-all duration-200 ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            {category && (
              <span className="text-sm text-primary-600 font-medium mb-2">
                {category.name}
              </span>
            )}

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(fullStars)].map((_, i) => (
                  <FaStar key={i} />
                ))}
                {hasHalfStar && <FaStarHalfAlt />}
                {[...Array(emptyStars)].map((_, i) => (
                  <FaRegStar key={i} />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.5)</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">245 reviews</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-4xl font-bold text-primary-600">
                ${price.toFixed(2)}
              </span>
              {stock_quantity > 0 && (
                <span className="ml-4 text-sm text-green-600 font-medium">
                  ✓ In Stock
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {stock_quantity > 0 ? (
                <span className="text-green-600 font-medium">
                  {stock_quantity} units available
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {description || 'No description available'}
              </p>
            </div>

            {/* Quantity Selector */}
            {stock_quantity > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={stock_quantity}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    disabled={quantity >= stock_quantity}
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={stock_quantity <= 0 || isAdding}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
                  stock_quantity > 0
                    ? 'btn-primary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart />
                <span>
                  {isAdding
                    ? 'Adding...'
                    : stock_quantity > 0
                    ? 'Add to Cart'
                    : 'Out of Stock'}
                </span>
              </button>

              <button
                onClick={handleSendToTelegram}
                disabled={isInquiring}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <FaTelegram />
                <span>{isInquiring ? 'Sending...' : 'Inquire on Telegram'}</span>
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleWishlist}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  isWishlisted ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <FaHeart />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <FaShare />
                <span>Share</span>
              </button>
            </div>

            {/* Product Meta */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500 space-y-2">
              <p>SKU: {`GC-${String(product.id || 0).padStart(6, '0')}`}</p>
              <p>Category: {category?.name || 'Uncategorized'}</p>
              <p>Availability: {stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;