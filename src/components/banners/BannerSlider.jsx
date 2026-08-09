import React from 'react';
import Slider from 'react-slick';
import BannerSlide from './BannerSlide';
import LoadingSpinner from '../common/LoadingSpinner';

const BannerSlider = ({ banners, loading }) => {
  if (loading) {
    return (
      <div className="h-64 md:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="h-64 md:h-96 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to Gadget Cambodia</h2>
          <p className="text-lg opacity-90">Your trusted tech store</p>
        </div>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {banners.map((banner) => (
          <BannerSlide key={banner.id} banner={banner} />
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;