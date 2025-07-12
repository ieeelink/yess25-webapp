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
            className="mx-12 sm:mx-20 flex items-center justify-center"
          >
            <img
              src={image}
              alt={`Logo ${index + 1}`}
              className="h-12 sm:h-16 lg:h-20 xl:h-24 2xl:h-28 w-auto object-contain max-h-[12vh] lg:max-h-[10vh] xl:max-h-[8vh] 2xl:max-h-[7vh] carousel-img-responsive aboutsection-text-responsive"
              loading="eager"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default InfiniteScroll;
