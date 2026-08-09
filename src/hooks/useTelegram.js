import { useState } from 'react';
import { telegramService } from '../services/telegramService';
import toast from 'react-hot-toast';

export const useTelegram = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (message) => {
    setIsSending(true);
    setError(null);
    try {
      const result = await telegramService.sendMessage(message);
      toast.success('Message sent to Telegram!');
      return result;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message to Telegram.');
      toast.error('Failed to send message');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const sendOrderConfirmation = async (orderData) => {
    setIsSending(true);
    setError(null);
    try {
      const result = await telegramService.sendOrderConfirmation(orderData);
      toast.success('Order confirmation sent to Telegram!');
      return result;
    } catch (err) {
      console.error('Error sending order confirmation:', err);
      setError('Failed to send order confirmation.');
      toast.error('Failed to send order confirmation');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const sendCartToTelegram = async (cartItems, customerInfo = null) => {
    setIsSending(true);
    setError(null);
    try {
      const result = await telegramService.sendCartToTelegram(cartItems, customerInfo);
      toast.success('Cart sent to Telegram!');
      return result;
    } catch (err) {
      console.error('Error sending cart:', err);
      setError('Failed to send cart to Telegram.');
      toast.error('Failed to send cart');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const sendProductInquiry = async (product, userInfo = null) => {
    setIsSending(true);
    setError(null);
    try {
      const result = await telegramService.sendProductInquiry(product, userInfo);
      toast.success('Inquiry sent to Telegram!');
      return result;
    } catch (err) {
      console.error('Error sending inquiry:', err);
      setError('Failed to send inquiry.');
      toast.error('Failed to send inquiry');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendMessage,
    sendOrderConfirmation,
    sendCartToTelegram,
    sendProductInquiry,
    isSending,
    error,
  };
};

export default useTelegram;