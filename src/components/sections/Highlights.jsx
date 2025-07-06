import React, { useState } from 'react';

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
    "top-0 left-2/8 -translate-x-1/2 w-40 h-28 z-20 md:-top-3 md:left-30 md:translate-x-0 md:w-60 md:h-40",
    "top-24 left-1/7 -translate-x-1/2 w-44 h-28 z-10 md:top-7 md:-left-42 md:translate-x-0 md:w-64 md:h-44",
    "top-20 left-6/7 -translate-x-1/2 w-44 h-28 z-20 md:top-60 md:left-50 md:translate-x-0 md:w-64 md:h-44",
    "top-40 left-3/5 -translate-x-1/2 w-40 h-28 z-10 md:top-30 md:left-80 md:translate-x-0 md:w-60 md:h-40",
    "top-58 left-1/6 -translate-x-1/2 w-40 h-28 z-10 md:top-45 md:left-10 md:translate-x-0 md:w-60 md:h-40",
    "-top-5 left-4/6 -translate-x-1/2 w-44 h-28 z-0 md:-top-30 md:left-0 md:translate-x-0 md:w-64 md:h-44",
    "top-60 left-5/6 -translate-x-1/2 w-44 h-28 z-0 md:top-60 md:-left-35 md:translate-x-0 md:w-64 md:h-44",
    "top-80 left-3/8 -translate-x-1/2 w-40 h-28 z-10 md:-top-20 md:left-80 md:translate-x-0 md:w-60 md:h-40"
  ];

  const images = [
    { src: "/images/Highlight7.webp", alt: "Event Highlight 1" },
    { src: "/images/Highlight2.webp", alt: "Event Highlight 2" },
    { src: "/images/Highlight3.webp", alt: "Event Highlight 3" },
    { src: "/images/Highlight4.webp", alt: "Event Highlight 4" },
    { src: "/images/Highlight5.webp", alt: "Event Highlight 5" },
    { src: "/images/Highlight6.webp", alt: "Event Highlight 6" },
    { src: "/images/Highlight1.webp", alt: "Event Highlight 7" },
    { src: "/images/Highlight8.webp", alt: "Event Highlight 8" }
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 w-full pt-12 md:pt-20 relative z-10 overflow-y-auto md:overflow-hidden">
        <h1 className="text-4xl font-bold text-white text-right px-4 md:pr-30 pt-10">Highlights'24</h1>
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)]">
          <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:py-8 pt-12 md:pt-8 overflow-visible order-1 md:order-2">
            <div className="relative w-full max-w-xs sm:max-w-md md:w-[500px] h-[450px] md:h-[350px] mx-auto">
              {images.map((image, index) => {
                const isActive = activeImage === index || hoveredImage === index;
                const scaleClass = isActive ? "scale-115" : index % 2 === 0 ? "hover:scale-115" : "hover:scale-120";
                const zClass = isActive ? "z-50" : positionClasses[index].match(/z-\d+/)?.[0] || "z-0";
                return (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                    className={`absolute object-cover rounded-lg shadow-lg transition-transform duration-300 ${positionClasses[index].replace(/z-\d+/, "")} ${scaleClass} ${zClass}`}
                  onTouchStart={() => handleTouchStart(index)}
                  onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                />
                );
              })}
            </div>
          </div>
          <div className="w-full md:w-2/5 p-4 md:p-12 text-white order-2 md:order-1 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4 pb-10">Largest Engineering Student's meet in Kerala</h2>
            <p className="mb-4 text-lg nunito-sans-body">
              The 1-day event predominantly provided an opportunity for the student community to meet highly intelligent and motivated peers, enhanced their skills through trainings, workshops, and competitions, and geared them up to face the professional career ahead of them.
            </p>
            <ul className="list-disc list-inside text-lg space-y-2 nunito-sans-body">
              <li>Largest student meet of IEEE Kerala Section</li>
              <li>Sessions led by pioneers of the industry</li>
              <li>Competitions to prove your mettle</li>
              <li>Broaden your network with industry experts</li>
              <li>Opportunity to meet like-minded people</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Highlights;




