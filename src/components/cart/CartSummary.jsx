import React from 'react';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTelegram } from 'react-icons/fa';
import { telegramService } from '../../services/telegramService';
import toast from 'react-hot-toast';

const CartSummary = () => {
  const { cartItems, totalPrice, getItemCount, clearCart } = useCart();

  const handleSendCartToTelegram = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    try {
      await telegramService.sendCartToTelegram(cartItems);
      toast.success('Cart sent to Telegram!');
    } catch (error) {
      toast.error('Failed to send cart to Telegram');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <FaShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Your cart is empty</p>
        <Link to="/products" className="btn-primary mt-4 inline-block w-full">
          Browse Products
        </Link>
      </div>
    );
  }

  // Calculate shipping
  const shippingCost = totalPrice >= 50 ? 0 : 5.00;
  const tax = totalPrice * 0.1; // 10% tax
  const grandTotal = totalPrice + shippingCost + tax;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({getItemCount()} items)</span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        {totalPrice < 50 && (
          <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-2">
            💡 Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span className="text-2xl text-primary-600">${grandTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 text-right mt-1">
            Including tax and shipping
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          to="/checkout"
          className="btn-primary w-full text-center block"
        >
          Proceed to Checkout
        </Link>
        
        <button
          onClick={handleSendCartToTelegram}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
        >
          <FaTelegram />
          <span>Send Cart to Telegram</span>
        </button>
        
        <button
          onClick={clearCart}
          className="w-full text-red-600 hover:text-red-700 font-medium transition-colors duration-200 text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ✅ Secure checkout<br />
          🔒 Your information is safe
        </p>
      </div>
    </div>
  );
};

export default CartSummary;