import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header2 from '../components/Header2';
import NewFooter from '../components/NewFooter';
import BgAnimation from '../components/BgAnimation';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import ContactPopup from '../components/ContactPopup';

const NOTE_BG = '#FFFFFF';
const NOTE_TEXT = '#FE4A56';
const NOTE_FOLD = '#FE4A56';
const NOTE_BADGE = '#FE4A56';
const NOTE_HIGHLIGHT = '#590404';

const highlightImages = [
  {
    src: '/images/Highlight21.jpeg',
    alt: 'Inaugration',
  },
  {
    src: '/images/Highlight20.jpeg',
    alt: 'The Dignitaries',
  },
  {
    src: '/images/Highlight1.webp',
    alt: "Drone and RC Car Show",
  },
  {
    src: '/images/Highlight9.webp',
    alt: 'INARA: When Fashion meets Technology',
  },
  {
    src: '/images/Highlight10.jpeg',
    alt: "INARA: The world's first AI-designed, VR-powered fashion show",
  },
  {
    src: '/images/Highlight6.webp',
    alt: "Automotive Expo by VTS Kerala Chapter",
  },
  {
    src: '/images/Highlight12.jpeg',
    alt: 'Industry Mentoring Program',
  },
  {
    src: '/images/Highlight13.jpeg',
    alt: 'Industry Mentoring Program',
  },
  {
    src: '/images/Highlight18.jpeg',
    alt: 'Steel and Motion Expo by IEEE RAS Kerala Chapter',
  },
  {
    src: '/images/Highlight19.jpeg',
    alt: 'Assistive Technology Makethon',
  },
  {
    src: '/images/Highlight2.webp',
    alt: "LINK Team 2024",
  },
  {
    src: '/images/Highlight5.webp',
    alt: 'Crazy Vibes...',
  },
];

function Gallery() {
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Handler to open popup (for SubFooter)
  const handleContactClick = useCallback(() => setShowContactPopup(true), []);
  const handleCloseContactPopup = useCallback(() => setShowContactPopup(false), []);

  return (
    <div className="min-h-screen bg-brand-black text-white overflow-x-hidden w-full relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BgAnimation />
      </div>
      <div className="relative z-10 bg-white/5 min-h-screen flex flex-col w-full">
        <Header2 />
        <main className="flex-1 pt-16 md:pt-20 lg:pt-24 px-2 sm:px-4 w-full mx-auto">
          <div className="text-center mb-2 sm:mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-brand-corel">YESS 2024 Highlights</h2>
            <p className="text-brand-white text-sm sm:text-base lg:text-lg">Capturing the best moments from our event</p>
          </div>
          
          {/* Image Carousel */}
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4 relative">
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
                },
                768: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                  coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 50,
                    modifier: 1,
                    slideShadows: false,
                  }
                },
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
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              className="mySwiper"
            >
              {highlightImages.map((image, index) => (
                <SwiperSlide key={index} className="w-full h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] md:h-[calc(100vh-16rem)] lg:w-[80%] lg:h-[calc(100vh-20rem)] xl:w-[75%] xl:h-[calc(100vh-20rem)] 2xl:w-[70%] 2xl:h-[calc(100vh-20rem)]">
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3 md:p-4 lg:p-5">
                      <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-medium">{image.alt}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <div className="absolute top-1/2 left-2 sm:left-4 right-2 sm:right-4 transform -translate-y-1/2 z-20 flex justify-between">
              <button className="swiper-button-prev custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm group">
                <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-500 group-hover:text-white transition-colors duration-300" />
              </button>
              <button className="swiper-button-next custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm group">
                <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-500 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>
          </div>
          
        </main>
        <NewFooter/>
      </div>
      
      <ContactPopup isOpen={showContactPopup} onClose={handleCloseContactPopup} />
      
      <style>{`
        body {
          overflow-x: hidden;
        }
        
        .swiper {
          width: 100%;
          height: calc(100vh - 12rem);
          padding-top: 0;
          padding-bottom: 0;
        }
        
        @media (min-width: 640px) {
          .swiper {
            height: calc(100vh - 14rem);
          }
        }
        
        @media (min-width: 768px) {
          .swiper {
            height: calc(100vh - 16rem);
          }
        }
        
        @media (min-width: 1024px) {
          .swiper {
            height: calc(100vh - 20rem);
            padding-top: 0;
            padding-bottom: 0;
          }
        }
        
        .swiper-slide {
          background-position: center;
          background-size: cover;
          width: 100%;
          height: calc(100vh - 12rem);
        }
        
        @media (min-width: 640px) {
          .swiper-slide {
            height: calc(100vh - 14rem);
          }
        }
        
        @media (min-width: 768px) {
          .swiper-slide {
            height: calc(100vh - 16rem);
          }
        }
        
        @media (min-width: 1024px) {
          .swiper-slide {
            width: 80%;
            height: calc(100vh - 20rem);
          }
        }
        
        @media (min-width: 1280px) {
          .swiper-slide {
            width: 75%;
            height: calc(100vh - 20rem);
          }
        }
        
        @media (min-width: 1536px) {
          .swiper-slide {
            width: 70%;
            height: calc(100vh - 20rem);
          }
        }
        
        .swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .custom-swiper-button {
          position: static !important;
          width: 36px !important;
          height: 36px !important;
          margin: 0 !important;
          z-index: 30 !important;
        }
        
        @media (min-width: 640px) {
          .custom-swiper-button {
            width: 42px !important;
            height: 42px !important;
          }
        }
        
        @media (min-width: 768px) {
          .custom-swiper-button {
            width: 48px !important;
            height: 48px !important;
          }
        }
        
        @media (max-width: 1023px) {
          .custom-swiper-button {
            position: absolute !important;
            z-index: 30 !important;
          }
        }
        
        .custom-swiper-button::after {
          display: none;
        }
        
        .swiper-pagination-bullet {
          background: #FE4A56 !important;
        }
        
        .swiper-pagination-bullet-active {
          background: #FE4A56 !important;
        }
      `}</style>
    </div>
  );
}

export default Gallery; 