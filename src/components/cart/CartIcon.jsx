import React from 'react';
import { useCart } from '../../hooks/useCart';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = ({ onClick, className = '' }) => {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${className}`}
      aria-label="Open cart"
    >
      <FaShoppingCart className="w-6 h-6 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default CartIcon;