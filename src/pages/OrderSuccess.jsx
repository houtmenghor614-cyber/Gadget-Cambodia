import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingCart } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'N/A';

  return (
    <div className="pt-20 container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Thank you for your order. We'll notify you when it's ready.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-bold text-primary-600">{orderNumber}</p>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            We've sent a confirmation to your email and Telegram.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-secondary flex items-center justify-center space-x-2">
              <FaHome />
              <span>Go Home</span>
            </Link>
            <Link to="/products" className="btn-primary flex items-center justify-center space-x-2">
              <FaShoppingCart />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;