import React from 'react';
import { useNavigate } from 'react-router-dom';
import yessIcon from '/yess_icon.png';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#18181b] text-white text-center px-4">
      <img src={yessIcon} alt="YESS Logo" className="w-24 h-24 mb-6" />
      <h1 className="text-7xl font-extrabold mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <p className="mb-8 text-lg italic text-gray-400 nunito-sans-body">Looks like you took a wrong turn at Albuquerque! 🐰🔀</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-[#fe4a56] hover:bg-[#8c0505] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}

export default NotFound; 