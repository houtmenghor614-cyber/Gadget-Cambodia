import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { getProductImage } from '../../utils/imageHelper';
import { 
  FaShoppingCart, 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaHeart, 
  FaEye,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaTag
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid', showCategory = false }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { id, name, price, image_url, description, stock_quantity, category } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock_quantity > 0) {
      addToCart(product);
      toast.success(`${name} added to cart!`, {
        icon: '🛒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      toast.error('Product is out of stock!');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  // Calculate rating (mock)
  const rating = 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const imageSrc = getProductImage(image_url);
  const isInStock = stock_quantity > 0;
  const isLowStock = stock_quantity > 0 && stock_quantity < 10;

  // Grid view - Beautiful Design
  if (viewMode === 'grid') {
    return (
      <div 
        className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <Link to={`/product/${id}`} className="block relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {!isInStock && (
              <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg tracking-wide">
                SOLD OUT
              </span>
            )}
            {isLowStock && isInStock && (
              <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg tracking-wide animate-pulse">
                ⚡ ONLY {stock_quantity} LEFT
              </span>
            )}
            {product.is_featured && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[10px] font-bold rounded-full shadow-lg tracking-wide">
                ⭐ FEATURED
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
          >
            <FaHeart 
              className={`text-lg transition-colors duration-300 ${
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Product Image */}
          <div className="h-56 md:h-64 overflow-hidden">
            <img
              src={imageSrc}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300/2563eb/FFFFFF?text=Gadget+Cambodia';
              }}
            />
          </div>

          {/* Quick Actions Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center gap-3 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Link
              to={`/product/${id}`}
              className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6"
            >
              <FaEye className="text-lg" />
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-6 ${
                isInStock 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart className="text-lg" />
            </button>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {showCategory && category && (
            <Link 
              to={`/products?category=${category.id}`}
              className="text-[10px] font-semibold text-primary-500 hover:text-primary-700 transition-colors duration-200 uppercase tracking-wider"
            >
              {category.name}
            </Link>
          )}

          {/* Product Name */}
          <Link to={`/product/${id}`}>
            <h3 className="text-base font-bold text-gray-900 hover:text-primary-600 transition-colors duration-200 line-clamp-1 mt-1">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex text-yellow-400">
              {[...Array(fullStars)].map((_, i) => <FaStar key={i} size={12} />)}
              {hasHalfStar && <FaStarHalfAlt size={12} />}
              {[...Array(emptyStars)].map((_, i) => <FaRegStar key={i} size={12} />)}
            </div>
            <span className="text-[11px] text-gray-500">(4.5)</span>
            <span className="text-[11px] text-gray-300">|</span>
            <span className={`text-[11px] font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 h-9 text-[13px]">
            {description || 'No description available'}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                ${price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-1.5 text-sm ${
                isInStock
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart className="text-sm" />
              <span>{isInStock ? 'Add' : 'Sold'}</span>
            </button>
          </div>

          {/* Free Shipping */}
          {price > 50 && isInStock && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-green-600">
              <FaTruck className="text-green-500" />
              <span>Free Shipping</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List view - Beautiful Design
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary-200">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link to={`/product/${id}`} className="relative sm:w-48 md:w-56 h-48 sm:h-52 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200/2563eb/FFFFFF?text=Gadget+Cambodia';
            }}
          />
          {!isInStock && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg tracking-wide">
              SOLD OUT
            </div>
          )}
          {isLowStock && isInStock && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg tracking-wide animate-pulse">
              ⚡ ONLY {stock_quantity} LEFT
            </div>
          )}
          {product.is_featured && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[10px] font-bold rounded-full shadow-lg tracking-wide">
              ⭐ FEATURED
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {showCategory && category && (
                <Link 
                  to={`/products?category=${category.id}`}
                  className="text-[10px] font-semibold text-primary-500 hover:text-primary-700 transition-colors duration-200 uppercase tracking-wider"
                >
                  {category.name}
                </Link>
              )}
              <Link to={`/product/${id}`}>
                <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors duration-200 mt-1">
                  {name}
                </h3>
              </Link>
            </div>
            <button
              onClick={handleWishlist}
              className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 flex-shrink-0"
            >
              <FaHeart 
                className={`text-lg transition-colors duration-300 ${
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                }`} 
              />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex text-yellow-400">
              {[...Array(fullStars)].map((_, i) => <FaStar key={i} size={13} />)}
              {hasHalfStar && <FaStarHalfAlt size={13} />}
              {[...Array(emptyStars)].map((_, i) => <FaRegStar key={i} size={13} />)}
            </div>
            <span className="text-[11px] text-gray-500">(4.5)</span>
            <span className="text-[11px] text-gray-300">|</span>
            <span className={`text-[11px] font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1 text-[13px]">
            {description || 'No description available'}
          </p>

          {/* Price and Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                ${price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
              {price > 50 && isInStock && (
                <span className="ml-3 text-[11px] text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  <FaTruck className="inline mr-1" /> Free Shipping
                </span>
              )}
            </div>
            <div className="flex gap-2.5">
              <Link
                to={`/product/${id}`}
                className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center gap-1.5 text-sm"
              >
                <FaEye className="text-sm" />
                <span>View</span>
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-1.5 text-sm ${
                  isInStock
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="text-sm" />
                <span>{isInStock ? 'Add to Cart' : 'Sold'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;