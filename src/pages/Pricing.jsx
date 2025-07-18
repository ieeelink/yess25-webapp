import React from "react";
import BgAnimation from '../components/BgAnimation';
import Header2 from '../components/Header2';

const features = [
  "Access to all keynote sessions",
  "Entry to hands-on workshops",
  "Participation certificate",
  "Networking with industry experts",
  "Access to fun tech games / contests",
  "Swag Kit / Goodie Bag"
];

const earlyBirdTickets = [
  { title: "IEEE Student MEMBERS", price: "₹400", features },
  { title: "IEEE GSM MEMBERS", price: "₹600", features },
  { title: "NON IEEE MEMBERS", price: "₹800", features }
];

const normalTickets = [
  { title: "IEEE Student MEMBERS", price: "₹500", features },
  { title: "IEEE GSM MEMBERS", price: "₹750", features },
  { title: "NON IEEE MEMBERS", price: "₹1000", features }
];

const PricingCard = ({ title, price, features }) => (
  <div className="flex flex-col items-center bg-white/90 rounded-3xl shadow-2xl w-full max-w-md border-2 border-transparent hover:border-[#FE4A56] transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(254,74,86,0.25)]">
    <div className="w-full rounded-t-3xl" style={{ background: 'linear-gradient(90deg, #590404 60%, #FE4A56 100%)' }}>
      <div className="flex flex-col items-center py-6">
        <span className="text-xl font-extrabold tracking-wider text-white drop-shadow">{title}</span>
        <span className="text-5xl font-black mt-2" style={{ color: '#FE4A56', letterSpacing: '0.04em' }}>{price}</span>
      </div>
    </div>
    <div className="w-full border-t border-gray-200"></div>
    <div className="flex-1 flex flex-col gap-3 px-8 py-6 w-full">
      <span className="text-base text-gray-700 mb-3 font-medium">All features you will get on this package or plan.</span>
      <ul className="text-base text-gray-700 space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="font-bold text-lg" style={{ color: '#FE4A56' }}>✔</span> {feature}
          </li>
        ))}
      </ul>
    </div>
    <button className="w-11/12 mx-auto mb-5 bg-gradient-to-r from-[#590404] to-[#FE4A56] hover:from-[#FE4A56] hover:to-[#590404] text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 text-lg tracking-wide ring-2 ring-[#FE4A56]/30 hover:ring-4 hover:ring-[#FE4A56]/60 focus:outline-none focus:ring-4 focus:ring-[#FE4A56]/80">
      Buy Ticket
    </button>
  </div>
);

const Pricing = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
    <div className="fixed inset-0 z-0">
      <BgAnimation />
    </div>
    <div className="w-full relative z-10">
      <Header2 />
      <div className="md:mt-20 mt-15 min-h-screen bg-black/20 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-5xl font-extrabold mb-10 tracking-tight text-center drop-shadow">Pricing</h1>
        <div className="max-w-5xl w-full flex flex-col gap-16">
          {/* Early Bird Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-8 text-center tracking-wide drop-shadow">Early Bird Tickets</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
              {earlyBirdTickets.map((ticket, idx) => (
                <PricingCard key={idx} {...ticket} />
              ))}
            </div>
          </div>
          {/* Normal Ticket Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-8 text-center tracking-wide drop-shadow">Normal Ticket</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
              {normalTickets.map((ticket, idx) => (
                <PricingCard key={idx} {...ticket} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-lg mt-16 text-center text-white/80 drop-shadow">This is the official Pricing page for YESS, created for Razorpay verification purposes.</p>
      </div>
    </div>
  </div>
);

export default Pricing; 