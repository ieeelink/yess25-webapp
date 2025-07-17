import React from 'react';
import InfiniteScroll from './InfiniteScroll';

const PartnersSection = ({ images }) => (
  <div className="w-full relative z-10 py-8">
    <InfiniteScroll images={images} />
  </div>
);

export default PartnersSection; 