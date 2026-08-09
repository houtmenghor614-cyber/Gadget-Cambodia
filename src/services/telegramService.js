// Simple Telegram Service - Opens chat with @hortmenghor
// NO BOT TOKEN REQUIRED - Just opens Telegram with pre-filled message

const TELEGRAM_USERNAME = 'hortmenghor';

export const telegramService = {
  /**
   * Send cart to Telegram with shipping information
   * @param {Array} cartItems - Array of cart items
   * @param {Object} customerInfo - Customer information (name, phone, address)
   * @param {number} totalPrice - Total price of cart
   * @returns {Object} - Success status
   */
  sendCartToTelegram: (cartItems, customerInfo = null, totalPrice = 0) => {
    console.log('Opening Telegram with cart...');
    
    if (!cartItems || cartItems.length === 0) {
      console.warn('Cart is empty');
      return { success: false, message: 'Cart is empty' };
    }
    
    let itemsList = '';
    let total = 0;
    
    cartItems.forEach((item, index) => {
      const subtotal = (item.price || 0) * (item.quantity || 0);
      total += subtotal;
      itemsList += `${index + 1}. ${item.name || 'Unknown'} x ${item.quantity || 0} = $${subtotal.toFixed(2)}\n`;
    });

    // Calculate shipping
    const shippingCost = total >= 50 ? 0 : 5.00;
    const grandTotal = total + shippingCost;

    let message = `🛒 SHOPPING CART - GADGET CAMBODIA\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📦 Items in Cart:\n`;
    message += `${itemsList || 'No items'}\n`;
    message += `💰 Subtotal: $${total.toFixed(2)}\n`;
    message += `🚚 Shipping: ${shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}\n`;
    message += `💵 Total: $${grandTotal.toFixed(2)}\n\n`;
    
    // Add customer information if provided
    if (customerInfo) {
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `👤 CUSTOMER INFORMATION\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `📛 Name: ${customerInfo.name || 'N/A'}\n`;
      message += `📞 Phone: ${customerInfo.phone || 'N/A'}\n`;
      message += `📧 Email: ${customerInfo.email || 'N/A'}\n\n`;
      message += `📍 Shipping Address:\n`;
      message += `${customerInfo.address || 'N/A'}\n`;
      
      if (customerInfo.notes) {
        message += `\n📝 Notes: ${customerInfo.notes}\n`;
      }
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📅 ${new Date().toLocaleString()}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create Telegram link to your account
    const telegramLink = `https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`;
    
    // Open in new window
    window.open(telegramLink, '_blank');
    
    return { success: true, message: 'Telegram opened' };
  },

  /**
   * Send order confirmation to Telegram with full details
   * @param {Object} orderData - Order data object
   * @returns {Object} - Success status
   */
  sendOrderConfirmation: (orderData) => {
    console.log('Opening Telegram with order...');
    
    if (!orderData) {
      console.warn('No order data');
      return { success: false, message: 'No order data' };
    }
    
    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      shipping_address, 
      items, 
      total, 
      order_number, 
      notes 
    } = orderData;
    
    // Calculate shipping
    const shippingCost = total >= 50 ? 0 : 5.00;
    const grandTotal = total + shippingCost;
    
    let itemsList = '';
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        const subtotal = (item.price || 0) * (item.quantity || 0);
        itemsList += `${index + 1}. ${item.product_name || 'Unknown'} x ${item.quantity || 0} = $${subtotal.toFixed(2)}\n`;
      });
    }

    let message = `🛍️ NEW ORDER - GADGET CAMBODIA\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📋 Order Number: ${order_number || 'N/A'}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 CUSTOMER INFORMATION\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📛 Name: ${customer_name || 'N/A'}\n`;
    message += `📧 Email: ${customer_email || 'N/A'}\n`;
    message += `📞 Phone: ${customer_phone || 'N/A'}\n\n`;
    message += `📍 Shipping Address:\n`;
    message += `${shipping_address || 'N/A'}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 ORDER ITEMS\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `${itemsList || 'No items'}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 Subtotal: $${total?.toFixed(2) || '0.00'}\n`;
    message += `🚚 Shipping: ${shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}\n`;
    message += `💵 Total: $${grandTotal.toFixed(2)}\n\n`;
    message += `📝 Notes: ${notes || 'No notes'}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🔔 New order received at ${new Date().toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    const telegramLink = `https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`;
    
    window.open(telegramLink, '_blank');
    
    return { success: true, message: 'Telegram opened' };
  },

  /**
   * Send product inquiry to Telegram
   * @param {Object} product - Product object
   * @param {Object} userInfo - Optional user information
   * @returns {Object} - Success status
   */
  sendProductInquiry: (product, userInfo = null) => {
    console.log('Opening Telegram with product inquiry...');
    
    if (!product) {
      console.warn('No product data');
      return { success: false, message: 'No product data' };
    }
    
    let message = `🔍 PRODUCT INQUIRY - GADGET CAMBODIA\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📱 Product: ${product?.name || 'Unknown'}\n`;
    message += `💰 Price: $${product?.price?.toFixed(2) || '0.00'}\n`;
    message += `📝 Description: ${product?.description || 'N/A'}\n\n`;
    
    if (userInfo) {
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `👤 CUSTOMER INFORMATION\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `📛 Name: ${userInfo.name || 'N/A'}\n`;
      message += `📞 Phone: ${userInfo.phone || 'N/A'}\n`;
      message += `📧 Email: ${userInfo.email || 'N/A'}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📅 ${new Date().toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    const telegramLink = `https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`;
    
    window.open(telegramLink, '_blank');
    
    return { success: true, message: 'Telegram opened' };
  },

  /**
   * Get Telegram link with custom message
   * @param {string} message - Custom message
   * @returns {string} - Telegram link
   */
  getTelegramLink: (message) => {
    const encodedMessage = encodeURIComponent(message || '');
    return `https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`;
  },

  /**
   * Open Telegram with custom message
   * @param {string} message - Custom message
   * @returns {Object} - Success status
   */
  openTelegram: (message) => {
    console.log('Opening Telegram...');
    
    const encodedMessage = encodeURIComponent(message || '');
    const telegramLink = `https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`;
    
    window.open(telegramLink, '_blank');
    
    return { success: true, message: 'Telegram opened' };
  }
};

export default telegramService;