import React from 'react';
import { useNavigate } from 'react-router-dom';
import BgAnimation from '../components/BgAnimation';

function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <>
      <BgAnimation />
      <div className="min-h-screen flex flex-col relative">
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
              <div className="text-center text-white">
                <div className="text-yellow-400 text-6xl mb-4">⚠</div>
                <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
                <p className="text-lg mb-6">Your payment was cancelled. No charges have been made to your account.</p>
                <p className="text-sm text-gray-300 mb-8">You can try again or contact support if you need assistance.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/tickets')}
                    className="bg-[#fe4a56] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8c0505] transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default PaymentCancelled; 