import React from 'react';
import { useNavigate } from 'react-router-dom';

function Highlights() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col" >
      <div className="flex-1 w-full pt-12 md:pt-20 relative z-10 overflow-y-auto md:overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)] items-center justify-center">
          {/* Left: Text Content */}
          <div className="w-full md:w-2/5 p-4 md:p-12 flex flex-col justify-center items-start"> 
            <div className="absolute top-36 right-20 text-3xl lg:text-5xl font-bold text-white">Highlights</div>

          
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              <span style={{ color: '#FE4A56' }}>Largest Student<br/></span>  
              <span style={{ color: '#FE4A56' }}>Congress of Kerala</span>
            </h1>
            <p className="mb-6 text-base md:text-lg max-w-md" style={{ color: '#FFFFFF' }}>
              The 3-day event predominantly provides an opportunity for the student community to meet highly intelligent and motivated peers, enhance their skills through trainings, workshops, and competitions, and gear them up to face the professional career ahead of them.
            </p>
            <ul className="list-disc list-inside text-base md:text-lg space-y-2 mb-8" style={{ color: '#FFFFFF' }}>
              <li>Largest student Congress of IEEE Kerala Section</li>
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




