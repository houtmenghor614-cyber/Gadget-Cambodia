import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useTelegram } from '../hooks/useTelegram';
import { productService } from '../services/productService';
import { getProductImage } from '../utils/imageHelper';
import { 
  FaShoppingCart, 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaTelegram, 
  FaMinus, 
  FaPlus, 
  FaArrowLeft, 
  FaHeart, 
  FaShare,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
  FaWhatsapp
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

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

  // Get the correct image URL using the helper
  const mainImage = getProductImage(image_url);

  const isInStock = stock_quantity > 0;
  const isLowStock = stock_quantity > 0 && stock_quantity < 10;

  return (
    <div className="pt-20 container-custom py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 mb-6"
      >
        <FaArrowLeft />
        <span>Back to Products</span>
      </button>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Product Image - Single Image Only */}
          <div>
            <div className="relative bg-gray-100 rounded-xl overflow-hidden h-80 md:h-96 lg:h-[500px]">
              <img
                src={mainImage}
                alt={name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', mainImage);
                  e.target.src = 'https://via.placeholder.com/600x400/2563eb/FFFFFF?text=Gadget+Cambodia';
                }}
              />
              {!isInStock && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                  Out of Stock
                </div>
              )}
              {isLowStock && isInStock && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg animate-pulse">
                  Only {stock_quantity} left!
                </div>
              )}
             
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            {category && (
              <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">
                {category.name}
              </span>
            )}

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex text-yellow-400">
                {[...Array(fullStars)].map((_, i) => <FaStar key={i} size={18} />)}
                {hasHalfStar && <FaStarHalfAlt size={18} />}
                {[...Array(emptyStars)].map((_, i) => <FaRegStar key={i} size={18} />)}
              </div>
              <span className="text-sm text-gray-600">(4.5)</span>
              <span className="text-sm text-gray-300">|</span>
              <span className="text-sm text-gray-600">245 reviews</span>
            </div>

            {/* Price */}
            <div className="mt-4">
              <span className="text-4xl font-bold text-primary-600">
                ${price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-lg text-gray-400 line-through ml-3">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-2 flex items-center gap-3">
              {isInStock ? (
                <>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> In Stock
                  </span>
                  {isLowStock && (
                    <span className="text-orange-500 text-sm font-medium">
                      ⚡ Only {stock_quantity} left
                    </span>
                  )}
                </>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {description || 'No description available'}
              </p>
            </div>

            {/* Features */}
           

            {/* Quantity Selector */}
            {isInStock && (
              <div className="flex items-center space-x-4 mt-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
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
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    disabled={quantity >= stock_quantity}
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || isAdding}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 text-base ${
                  isInStock && !isAdding
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart />
                <span>
                  {isAdding
                    ? 'Adding...'
                    : isInStock
                    ? 'Add to Cart'
                    : 'Out of Stock'}
                </span>
              </button>

             
            </div>

            {/* Additional Actions */}
            <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleWishlist}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  isWishlisted ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <FaHeart className={`text-lg ${isWishlisted ? 'fill-red-500' : ''}`} />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <FaShare />
                <span>Share</span>
              </button>
              <a
                href={`https://wa.me/?text=Check%20out%20${encodeURIComponent(name)}%20at%20Gadget%20Cambodia%20-%20$${price}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
              >
                <FaWhatsapp className="text-lg" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Product Meta */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500 space-y-2">
              <p>SKU: {`GC-${String(product.id || 0).padStart(6, '0')}`}</p>
              <p>Category: {category?.name || 'Uncategorized'}</p>
              <p>Availability: {isInStock ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;