import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from '../../utils/imageHelper';
import { FaTelegram, FaShoppingCart, FaTruck, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { telegramService } from '../../services/telegramService';

const OrderSummary = ({ cartItems, totalPrice, customerInfo = null }) => {
  const [sending, setSending] = useState(false);
  const shippingCost = totalPrice >= 50 ? 0 : 2.00;
  const grandTotal = totalPrice + shippingCost;

  const handleSendToTelegram = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setSending(true);
    try {
      // Pass customer info and total price to include shipping details
      telegramService.sendCartToTelegram(cartItems, customerInfo, totalPrice);
      toast.success('✅ Opening Telegram...');
    } catch (error) {
      console.error('Error:', error);
      toast.error('❌ Failed to open Telegram');
    } finally {
      setSending(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <FaShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Your cart is empty</p>
        <Link to="/products" className="btn-primary mt-4 inline-block w-full">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
        Order Summary
      </h3>
      
      {/* Cart Items Preview */}
      <div className="max-h-64 overflow-y-auto space-y-3 mb-4 pr-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0">
            {/* Product Image */}
            <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={getProductImage(item.image_url)}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/56x56/2563eb/FFFFFF?text=No+Image';
                }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-primary-600">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cartItems.length} items)</span>
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
        
        {totalPrice < 50 && (
          <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-2 mt-2">
            💡 Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-2xl text-primary-600">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaTruck className="text-green-500" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaShieldAlt className="text-blue-500" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        Opens chat with @hortmenghor with cart + shipping info
      </p>
    </div>
  );
};

export default OrderSummary;