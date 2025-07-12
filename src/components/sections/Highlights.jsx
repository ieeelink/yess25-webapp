import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Highlights() {
  const [activeImage, setActiveImage] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleTouchStart = (index) => {
    setActiveImage(index);
  };

  const handleTouchEnd = () => {
    setActiveImage(null);
  };

  const handleMouseEnter = (index) => {
    setHoveredImage(index);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  const positionClasses = [
    "top-0 left-2/8 -translate-x-1/2 w-40 h-28 z-20 lg:-top-3 lg:left-30 lg:translate-x-0 lg:w-60 lg:h-40",
    "top-24 left-1/7 -translate-x-1/2 w-44 h-28 z-10 lg:top-7 lg:-left-42 lg:translate-x-0 lg:w-64 lg:h-44",
    "top-20 left-6/7 -translate-x-1/2 w-44 h-28 z-20 lg:top-60 lg:left-50 lg:translate-x-0 lg:w-64 lg:h-44",
    "top-40 left-3/5 -translate-x-1/2 w-40 h-28 z-10 lg:top-30 lg:left-80 lg:translate-x-0 lg:w-60 lg:h-40",
    "top-58 left-1/6 -translate-x-1/2 w-40 h-28 z-10 lg:top-45 lg:left-10 lg:translate-x-0 lg:w-60 lg:h-40",
    "-top-5 left-4/6 -translate-x-1/2 w-44 h-28 z-0 lg:-top-30 lg:left-0 lg:translate-x-0 lg:w-64 lg:h-44",
    "top-60 left-5/6 -translate-x-1/2 w-44 h-28 z-0 lg:top-60 lg:-left-35 lg:translate-x-0 lg:w-64 lg:h-44",
    "top-80 left-3/8 -translate-x-1/2 w-40 h-28 z-10 lg:-top-20 lg:left-80 lg:translate-x-0 lg:w-60 lg:h-40"
  ];

  const images = [
    { src: "/images/Highlight10.jpeg", alt: "Event Highlight 1" },
    { src: "/images/Highlight2.webp", alt: "Event Highlight 2" },
    { src: "/images/Highlight3.webp", alt: "Event Highlight 3" },
    { src: "/images/Highlight4.webp", alt: "Event Highlight 4" },
    { src: "/images/Highlight5.webp", alt: "Event Highlight 5" },
    { src: "/images/Highlight6.webp", alt: "Event Highlight 6" },
    { src: "/images/Highlight1.webp", alt: "Event Highlight 7" },
    { src: "/images/Highlight13.jpeg", alt: "Event Highlight 8" }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center min-h-0 w-screen relative z-10 lg:px-8">
        <div className="w-full px-4 lg:px-0 lg:px-6 flex flex-col min-h-0 flex-1 aboutsection-text-responsive" style={{height: '100%', minHeight: 0, maxWidth: 'min(1600px, 100vw)'}}>
          <div className="w-full lg:mb-4">
            <h1 className="text-3xl lg:text-5xl font-bold text-white text-left main-heading-responsive">Highlights'24</h1>
          </div>
          
          <div className="w-full flex flex-col lg:flex-row lg:overflow-x-auto lg:gap-8 scrollbar-hide min-h-0 aboutsection-text-responsive" style={{minHeight: 0}}>
            <div className="w-full lg:w-3/5 flex items-center justify-center p-4 lg:py-8 pt-12 lg:pt-8 overflow-visible order-1 lg:order-2">
              <div className="relative w-full max-w-xs sm:max-w-md lg:w-[500px] h-[450px] lg:h-[350px] mx-auto">
                {images.map((image, index) => {
                  const isActive = activeImage === index || hoveredImage === index;
                  const scaleClass = isActive ? "scale-115" : index % 2 === 0 ? "hover:scale-115" : "hover:scale-120";
                  const zClass = isActive ? "z-50" : positionClasses[index].match(/z-\d+/)?.[0] || "z-0";
                  return (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                      className={`absolute object-cover rounded-lg shadow-lg transition-transform duration-300 ${positionClasses[index].replace(/z-\d+/, "")} ${scaleClass} ${zClass} highlights-img-responsive highlights-img-pos-step${index}`}
                    onTouchStart={() => handleTouchStart(index)}
                    onTouchEnd={handleTouchEnd}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                  />
                  );
                })}
              </div>
            </div>
            <div className="w-full lg:w-2/5 p-4 lg:p-6 text-white order-2 lg:order-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4 aboutsection-text-responsive">Largest Engineering Student's meet in Kerala</h2>
              <p className="mb-4 text-lg nunito-sans-body aboutsection-text-responsive">
                The 1-day event predominantly provided an opportunity for the student community to meet highly intelligent and motivated peers, enhanced their skills through trainings, workshops, and competitions, and geared them up to face the professional career ahead of them.
              </p>
              <ul className="list-disc list-inside text-lg space-y-2 nunito-sans-body aboutsection-text-responsive">
                <li className="aboutsection-text-responsive">Largest student meet of IEEE Kerala Section</li>
                <li className="aboutsection-text-responsive">Sessions led by pioneers of the industry</li>
                <li className="aboutsection-text-responsive">Competitions to prove your mettle</li>
                <li className="aboutsection-text-responsive">Broaden your network with industry experts</li>
                <li className="aboutsection-text-responsive">Opportunity to meet like-minded people</li>
              </ul>
              <div className="pt-6 pl-0 flex justify-center lg:justify-start">
                <Link 
                  to="/gallery" 
                  className="inline-block px-12 py-4 text-xl bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-110 aboutsection-text-responsive"
                >
                  Know More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Highlights;




