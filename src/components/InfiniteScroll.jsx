import React from 'react';
import Marquee from 'react-fast-marquee';

const InfiniteScroll = ({ images }) => {
  return (
    <div className="w-full overflow-hidden">
      <Marquee
        gradient={false}
        speed={50}
        pauseOnHover={false}
        direction="left"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="mx-3 sm:mx-6 flex items-center justify-center"
          >
            <img
              src={image}
              alt={`Logo ${index + 1}`}
              className="h-12 sm:h-16 w-auto object-contain"
              loading="eager"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default InfiniteScroll;
