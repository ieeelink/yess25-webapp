import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NOTE_BG = '#FFFFFF';
const NOTE_TEXT = '#FE4A56';
const NOTE_FOLD = '#FE4A56';
const NOTE_BADGE = '#FE4A56';
const NOTE_HIGHLIGHT = '#590404';

const highlightImages = [
  {
    src: '/images/Highlight1.webp',
    alt: "The world's first AI-designed, VR-powered fashion show",
  },
  {
    src: '/images/Highlight2.webp',
    alt: "India's inaugural Assistive Technology Makeathon",
  },
  {
    src: '/images/Highlight3.webp',
    alt: "India's first Datathon in partnership with IEEE Dataport",
  },
  {
    src: '/images/Highlight4.webp',
    alt: 'Industry Face-to-Face Mentoring Program',
  },
  {
    src: '/images/Highlight5.webp',
    alt: 'Humanitarian Project Expo',
  },
  {
    src: '/images/Highlight6.webp',
    alt: 'Experience India\'s first water metro ride',
  },
  {
    src: '/images/Highlight7.webp',
    alt: 'Robotics and Drone expo',
  },
  {
    src: '/images/Highlight8.webp',
    alt: 'Disaster management workshops',
  },
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const carouselContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enable horizontal wheel/trackpad scroll to change slides on desktop
  useEffect(() => {
    if (isMobile) return;
    const container = carouselContainerRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 0) {
          sliderRef.current?.slickNext();
        } else if (e.deltaX < 0) {
          sliderRef.current?.slickPrev();
        }
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isMobile]);

  const handleImageClick = (index) => {
    setSelectedImage(selectedImage === index ? null : index);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    arrows: true,
    beforeChange: (oldIndex, newIndex) => setCenterIndex(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Helper to get the real center index for infinite mode
  const getRealCenter = (idx) => {
    return ((centerIndex % highlightImages.length) + highlightImages.length) % highlightImages.length;
  };

  return (
    <div className="min-h-screen bg-brand-black text-white overflow-x-clip w-screen max-w-screen box-border relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BgAnimation />
      </div>
      <div className={`relative z-10 bg-white/5 min-h-screen flex flex-col w-screen max-w-screen box-border${isMobile ? ' mobile-scroll-fix' : ''}`}>
        <Header />
        <main className={`flex-1 pt-24 pb-8 px-0 w-screen max-w-screen mx-0 box-border${isMobile ? ' overflow-y-auto' : ' overflow-y-hidden'}`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-brand-corel">YESS 2024 Highlights</h2>
            <p className="text-brand-white text-lg">Capturing the best moments from our event</p>
          </div>
          {isMobile ? (
            // On mobile, ensure vertical scrolling is always possible
            <div className="grid grid-cols-1 gap-8 px-4" style={{ maxHeight: 'none', overflowY: 'auto' }}>
            {highlightImages.map((img, idx) => (
              <div
                key={idx}
                  className="w-full max-w-sm min-h-[400px] h-[400px] flex flex-col justify-between cursor-pointer select-none transition-transform duration-500 rounded-2xl border-2 outline-none focus:ring-2 focus:ring-[#FE4A56] mx-auto bg-white shadow-2xl border-[#FE4A56] z-20"
                >
                  {/* Badge (Pin) */}
                  <div
                    className="absolute -top-5 left-5 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md border-2 z-10"
                    style={{
                      background: NOTE_BADGE,
                      color: NOTE_BG === '#FFFFFF' ? '#590404' : '#FFFFFF',
                      borderColor: NOTE_FOLD
                    }}
                  >
                    {idx + 1}
                  </div>
                  {/* Corner Fold */}
                  <div
                    className="absolute top-0 right-0 w-0 h-0 border-l-[36px] border-l-transparent border-t-[36px]"
                    style={{ borderTopColor: NOTE_FOLD, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))' }}
                  ></div>
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-xl mt-10 mb-4 mx-4 flex-1 flex items-center justify-center shadow-lg">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-56 object-cover rounded-xl border border-[#FE4A56]"
                      loading="lazy"
                    />
                  </div>
                  {/* Event Title */}
                  <div className="px-6 pb-6 text-center">
                    <h3
                      className="font-extrabold text-2xl leading-tight transition-all duration-300 text-[#590404] bg-white/80 rounded-lg px-2 py-2 shadow-md inline-block"
                    >
                      {img.alt}
                    </h3>
                  </div>
              </div>
            ))}
          </div>
          ) : (
            <div ref={carouselContainerRef} className="w-screen max-w-screen overflow-x-hidden overflow-y-hidden box-border">
              <Slider ref={sliderRef} {...settings} className="py-8 modern-card-slider w-screen max-w-screen box-border">
                {highlightImages.map((img, idx) => {
                  const isCenter = getRealCenter(idx) === idx;
                  return (
                    <div key={idx} className="px-2 flex justify-center items-center modern-card-slide">
                      {isCenter ? (
                        <div
                          aria-label={img.alt}
                          tabIndex={0}
                          onClick={() => handleImageClick(idx)}
                          onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleImageClick(idx)}
                          className={`relative w-full max-w-sm min-h-[400px] h-[400px] flex flex-col justify-between cursor-pointer select-none transition-transform duration-500 rounded-2xl border-2 outline-none focus:ring-2 focus:ring-[#FE4A56] mx-auto bg-white shadow-2xl border-[#FE4A56] z-20`}
                        >
                          {/* Badge (Pin) */}
                          <div
                            className="absolute -top-5 left-5 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md border-2 z-10"
                            style={{
                              background: NOTE_BADGE,
                              color: NOTE_BG === '#FFFFFF' ? '#590404' : '#FFFFFF',
                              borderColor: NOTE_FOLD
                            }}
                          >
                            {idx + 1}
                          </div>
                          {/* Corner Fold */}
                          <div
                            className="absolute top-0 right-0 w-0 h-0 border-l-[36px] border-l-transparent border-t-[36px]"
                            style={{ borderTopColor: NOTE_FOLD, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))' }}
                          ></div>
                          {/* Image */}
                          <div className="relative overflow-hidden rounded-xl mt-10 mb-4 mx-4 flex-1 flex items-center justify-center shadow-lg">
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="w-full h-56 object-cover rounded-xl border border-[#FE4A56]"
                              loading="lazy"
                            />
                          </div>
                          {/* Event Title */}
                          <div className="px-6 pb-6 text-center">
                            <h3
                              className="font-extrabold text-2xl leading-tight transition-all duration-300 text-[#590404] bg-white/80 rounded-lg px-2 py-2 shadow-md inline-block"
                            >
                              {img.alt}
                            </h3>
                          </div>
              </div>
                      ) : (
                        <div className="w-full max-w-sm min-h-[340px] h-[340px] flex flex-col justify-center items-center bg-white rounded-none border-none shadow-none p-0 m-0 overflow-hidden">
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover rounded-none border-none p-0 m-0"
                            loading="lazy"
                          />
          </div>
                      )}
      </div>
                  );
                })}
              </Slider>
        </div>
      )}
        </main>
        <SubFooter />
      </div>
      <style>{`
        .modern-card-slider .slick-list {
          overflow: visible !important;
        }
        .modern-card-slider .slick-track {
          display: flex;
          align-items: center;
        }
        .modern-card-slider .slick-slide {
          transition: transform 0.5s cubic-bezier(.4,2,.6,1), z-index 0.5s, opacity 0.5s;
          z-index: 1;
          opacity: 0.6;
          filter: blur(1px) grayscale(0.2);
          overflow: visible !important;
        }
        .modern-card-slider .slick-center {
          transform: scale(1.05) translateY(-10px) !important;
          z-index: 3;
          opacity: 1;
          filter: none;
          box-shadow: 0 8px 32px 0 rgba(254,74,86,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.10);
        }
        .modern-card-slider .slick-slide.slick-active:not(.slick-center) {
          transform: scale(0.93) translateY(10px) !important;
          z-index: 2;
          opacity: 0.8;
          filter: blur(0.5px) grayscale(0.1);
        }
        .modern-card-slider .slick-slide:not(.slick-active) {
          transform: scale(0.85) translateY(24px) !important;
          z-index: 1;
          opacity: 0.4;
          filter: blur(2px) grayscale(0.3);
        }
        /* Mobile scroll fix: ensure vertical scrolling is always possible */
        @media (max-width: 639px) {
          .mobile-scroll-fix {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            min-height: 100vh;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default Gallery; 