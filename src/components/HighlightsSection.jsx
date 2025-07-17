import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const HighlightsSection = ({ highlightImages }) => (
  <div id="highlights" className="w-full flex justify-center pb-16 z-20 relative backdrop-blur-sm bg-black/20">
    <div className="w-full px-4 lg:px-8 md:px-6 relative z-10" style={{maxWidth: 'min(1600px, 100vw)'}}>
      <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center py-12">
        {/* Left: Heading, images, text, button (mobile: images between headings and text) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-0">
          <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Highlights'24</h3>
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Largest Engineering Student's meet in Kerala</h2>
          {/* SwiperJS Carousel - Mobile */}
          <div className="w-full h-64 mb-6 lg:hidden relative">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              loop={true}
              loopAdditionalSlides={2}
              speed={800}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                  coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 30,
                    modifier: 1,
                    slideShadows: false,
                  }
                },
                640: {
                  slidesPerView: 1,
                  spaceBetween: 15,
                  coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 40,
                    modifier: 1,
                    slideShadows: false,
                  }
                }
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.swiper-button-next-mobile',
                prevEl: '.swiper-button-prev-mobile',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              className="h-full"
            >
              {highlightImages.map((image, index) => (
                <SwiperSlide key={index} className="w-full h-64">
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white text-sm font-medium">{image.alt}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom Navigation Buttons - Mobile */}
            <div className="absolute top-1/2 left-2 right-2 transform -translate-y-1/2 z-20 flex justify-between pointer-events-none">
              <button className="swiper-button-prev-mobile custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm group pointer-events-auto">
                <FiArrowLeft className="w-4 h-4 text-red-500 group-hover:text-white transition-colors duration-300" />
              </button>
              <button className="swiper-button-next-mobile custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm group pointer-events-auto">
                <FiArrowRight className="w-4 h-4 text-red-500 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>
          </div>
          <p className="mb-4 text-base nunito-sans-body leading-relaxed">
            The 1-day event predominantly provided an opportunity for the student community to meet highly intelligent and motivated peers, enhanced their skills through trainings, workshops, and competitions, and geared them up to face the professional career ahead of them.
          </p>
          <ul className="list-disc list-inside text-base space-y-2 nunito-sans-body">
            <li>Largest student meet of IEEE Kerala Section</li>
            <li>Sessions led by pioneers of the industry</li>
            <li>Competitions to prove your mettle</li>
            <li>Broaden your network with industry experts</li>
            <li>Opportunity to meet like-minded people</li>
          </ul>
        </div>
        {/* Right: SwiperJS Carousel (desktop only) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:py-8 pt-12 lg:pt-8 overflow-visible hidden lg:flex">
          <div className="relative w-full h-96 lg:h-[400px]">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              loop={true}
              loopAdditionalSlides={2}
              speed={800}
              breakpoints={{
                1024: {
                  slidesPerView: 'auto',
                  spaceBetween: 30,
                  coverflowEffect: {
                    rotate: 30,
                    stretch: 0,
                    depth: 80,
                    modifier: 1,
                    slideShadows: true,
                  }
                },
                1280: {
                  slidesPerView: 'auto',
                  spaceBetween: 40,
                  coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }
                }
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.swiper-button-next-desktop',
                prevEl: '.swiper-button-prev-desktop',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              className="h-full"
            >
              {highlightImages.map((image, index) => (
                <SwiperSlide key={index} className="w-[80%] lg:w-[75%] xl:w-[70%] h-96 lg:h-[400px]">
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-base lg:text-lg font-medium">{image.alt}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom Navigation Buttons - Desktop */}
            <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 z-20 flex justify-between">
              <button className="swiper-button-prev-desktop custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group">
                <FiArrowLeft className="w-5 h-5 text-red-500 group-hover:text-white transition-colors duration-300" />
              </button>
              <button className="swiper-button-next-desktop custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group">
                <FiArrowRight className="w-5 h-5 text-red-500 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HighlightsSection; 