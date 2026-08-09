import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStickyNote } from 'react-icons/fa';

const CheckoutForm = ({ formData, onChange, onSubmit, loading }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (!formData.shipping_address.trim()) newErrors.shipping_address = 'Address is required';
    if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Invalid email format';
    }
    if (formData.customer_phone && !/^\+?[0-9]{8,15}$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Invalid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
        Shipping Information
      </h2>
      
      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className={`w-full pl-10 pr-4 py-3 border ${errors.customer_name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
              placeholder="Your full name"
            />
          </div>
          {errors.customer_name && (
            <p className="mt-1 text-sm text-red-500">{errors.customer_name}</p>
          )}
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${errors.customer_email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                placeholder="your@email.com"
              />
            </div>
            {errors.customer_email && (
              <p className="mt-1 text-sm text-red-500">{errors.customer_email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${errors.customer_phone ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                placeholder="+855 12 345 678"
              />
            </div>
            {errors.customer_phone && (
              <p className="mt-1 text-sm text-red-500">{errors.customer_phone}</p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Shipping Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400" />
            <textarea
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              required
              rows="3"
              className={`w-full pl-10 pr-4 py-3 border ${errors.shipping_address ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
              placeholder="Street, City, Province, Postal Code"
            />
          </div>
          {errors.shipping_address && (
            <p className="mt-1 text-sm text-red-500">{errors.shipping_address}</p>
          )}
        </div>

        {/* Order Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Order Notes (Optional)
          </label>
          <div className="relative">
            <FaStickyNote className="absolute left-3 top-4 text-gray-400" />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Any special instructions or delivery notes"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <span>Place Order To Telegram</span>
              <span className="text-xl">→</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          By placing your order, you agree to our Terms & Conditions
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;