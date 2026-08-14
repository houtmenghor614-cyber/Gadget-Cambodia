import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import { telegramService } from '../services/telegramService';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import OrderConfirmation from '../components/checkout/OrderConfirmation';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    notes: '',
  });

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!formData.customer_name || !formData.shipping_address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        total: totalPrice,
      };

      const response = await orderService.createOrder(orderPayload);
      
      // Send to Telegram
      telegramService.sendOrderConfirmation({
        ...response,
        ...orderPayload,
      });

      clearCart();
      
      setOrderData({ ...response, ...orderPayload });
      setStep(2);
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2 && orderData) {
    return (
      <div className="pt-20 container-custom py-12">
        <OrderConfirmation 
          orderNumber={orderData.order_number} 
          orderData={orderData}
        />
      </div>
    );
  }

  return (
    <div className="pt-20 container-custom py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Complete your order information</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <CheckoutForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-2">
          <OrderSummary
            cartItems={cartItems}
            totalPrice={totalPrice}
            customerInfo={formData}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;