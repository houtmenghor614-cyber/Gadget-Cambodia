import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingCart, FaWhatsapp, FaTelegram } from 'react-icons/fa';

const OrderConfirmation = ({ orderNumber, orderData }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
          <FaCheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Placed Successfully! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your order. We'll notify you when it's ready for delivery.
        </p>
        
        {/* Order Number */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-2xl font-bold text-primary-600">{orderNumber}</p>
        </div>

        {/* Order Summary */}
        {orderData && (
          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="text-gray-900">{orderData.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900">{orderData.customer_email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-900">{orderData.customer_phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Items:</span>
                <span className="text-gray-900">{orderData.items?.length || 0}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-700">Total:</span>
                <span className="text-primary-600">${orderData.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/" 
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <FaHome />
            <span>Go Home</span>
          </Link>
          <Link 
            to="/products" 
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <FaShoppingCart />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Share Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Share your order</p>
          <div className="flex justify-center space-x-4">
            <a
              href={`https://wa.me/?text=🎉%20I%20just%20placed%20an%20order%20at%20Gadget%20Cambodia!%20Order%20%23${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200 hover:scale-110 transform"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
            <a
              href={`https://t.me/share/url?url=I%20just%20placed%20an%20order%20at%20Gadget%20Cambodia!%20Order%20%23${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 hover:scale-110 transform"
            >
              <FaTelegram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;