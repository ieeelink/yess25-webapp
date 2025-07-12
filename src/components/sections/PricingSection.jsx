import React from 'react';

const PRICING = [
  { type: 'IEEE Member', price: 800 },
  { type: 'Non-Member', price: 1200 },
  { type: 'Graduate Student Member (GSM)', price: 1000 },
];

function PricingSection() {
  return (
    <section id="pricing" className="py-12 px-4 flex flex-col items-center bg-black/30 backdrop-blur rounded-xl my-8">
      <h2 className="text-3xl font-bold text-white mb-6">Ticket Pricing</h2>
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING.map(({ type, price }) => (
          <div key={type} className="bg-[#18181b] border border-[#fe4a56]/40 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <div className="text-lg font-semibold text-white mb-2 text-center">{type}</div>
            <div className="text-4xl font-bold text-[#fe4a56] mb-2">₹{price}</div>
            <div className="text-xs text-gray-400">per person</div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-300 text-center max-w-xl">
        All prices include GST. <span className="text-[#fe4a56] font-semibold">Accommodation extra.</span>
      </div>
    </section>
  );
}

export default PricingSection; 