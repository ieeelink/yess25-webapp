import React from 'react';

function SponsorsSection() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#e32b2b]/3 border-t-2 border-b-2 border-white/20">
      <div className="w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Our Sponsors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white/60">Sponsor 1</span>
          </div>
          <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white/60">Sponsor 2</span>
          </div>
          <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white/60">Sponsor 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SponsorsSection; 