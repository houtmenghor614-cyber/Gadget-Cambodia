import React from 'react';
import { useCart } from '../../hooks/useCart';
import { getProductImage } from '../../utils/imageHelper';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { id, name, price, image_url, quantity } = item;

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(id, quantity - 1);
  };

  const handleRemove = () => {
    removeFromCart(id);
  };

  // Get the correct image URL
  const imageSrc = getProductImage(image_url);

  return (
    <div className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80/2563eb/FFFFFF?text=No+Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
        <p className="text-sm font-semibold text-primary-600">
          ${price.toFixed(2)}
        </p>
        
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={handleDecrement}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Decrease quantity"
          >
            <FaMinus className="w-3 h-3 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700 w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Increase quantity"
          >
            <FaPlus className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Subtotal & Remove */}
      <div className="flex flex-col items-end space-y-2">
        <span className="text-sm font-semibold text-gray-900">
          ${(price * quantity).toFixed(2)}
        </span>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
          aria-label="Remove item"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;