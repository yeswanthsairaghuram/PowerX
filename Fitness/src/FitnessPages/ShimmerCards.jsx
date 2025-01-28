import React from 'react';
import './ShimmerCards.css';

const ShimmerCard = () => {
  return (
    <div className='shimmer-wrapper'>
      {[...Array(8)].map((_, index) => (
        <div className="shimmer-card" key={index}>
          <div className="shimmer-category shimmer-animate"></div>
          <div className="shimmer-image shimmer-animate"></div>
          <div className="shimmer-title shimmer-animate"></div>
          <div className="shimmer-info shimmer-animate"></div>
          <div className="shimmer-benefits shimmer-animate"></div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerCard;
