import React from 'react';
import { getBannerImage } from '../../utils/imageHelper';

const BannerSlide = ({ banner }) => {
  const { title, subtitle, image_url, link_url } = banner;

  const imageSrc = getBannerImage(image_url);

  return (
    <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Banner image failed to load:', imageSrc);
          e.target.src = 'https://via.placeholder.com/1200x400/2563eb/FFFFFF?text=Gadget+Cambodia';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
        <div className="container-custom">
          <div className="max-w-lg text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">{title}</h2>
            {subtitle && (
              <p className="text-lg md:text-xl mb-4 opacity-90">{subtitle}</p>
            )}
            {link_url && (
              <a
                href={link_url}
                className="inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Shop Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSlide;