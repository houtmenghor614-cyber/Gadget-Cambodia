import React from 'react';
import { FaTelegram } from 'react-icons/fa';

const TelegramLink = ({ message, children, className = '', variant = 'button' }) => {
  const encodedMessage = encodeURIComponent(message || '');
  const telegramLink = `https://t.me/hortmenghor?text=${encodedMessage}`;

  if (variant === 'icon') {
    return (
      <a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block hover:scale-110 transition-transform duration-200 ${className}`}
        title="Chat on Telegram"
      >
        <FaTelegram className="text-3xl text-blue-500 hover:text-blue-600" />
      </a>
    );
  }

  return (
    <a
      href={telegramLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg ${className}`}
    >
      <FaTelegram className="text-xl" />
      <span>{children || 'Chat on Telegram'}</span>
    </a>
  );
};

export default TelegramLink;