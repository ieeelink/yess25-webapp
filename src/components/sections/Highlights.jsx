import React from 'react';
import { useNavigate } from 'react-router-dom';

function Highlights() {
  const navigate = useNavigate();
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
            <button
              className="px-6 py-2 rounded font-semibold transition-colors duration-300 shadow-lg border"
              style={{
                background: '#FE4A56',
                color: '#FFFFFF',
                borderColor: '#590404',
              }}
              onClick={() => navigate('/gallery')}
            >
              know More &rarr;
            </button>
          </div>
          {/* Right: Group Image */}
          <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:py-8">
            <img
              src="/images/Highlight5.webp"
              alt="Largest Student Congress Group"
              className="rounded-lg shadow-2xl object-cover w-full max-w-lg h-80 md:h-[24rem] border-4"
              style={{ borderColor: '#590404', background: '#000000' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Highlights;




