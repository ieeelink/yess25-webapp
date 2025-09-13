import React from "react";
import { FiMapPin, FiCalendar } from "react-icons/fi";

const LandingSection = ({
  scrollToSection,
  isScrolled,
  onOpenTicketForm,
  onOpenCheckStatus,
}) => {
  return (
    <div className="relative z-10 w-full h-screen">
      <div
        id="landing"
        className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center justify-center px-4 space-y-4 text-center">
          {/* YESS Logo - Only visible on desktop */}
          <div className="mb-8 ">
            <img
              src="/yess_icon.svg"
              alt="IEEE YESS Logo"
              className="w-32 h-auto lg:w-40"
            />
          </div>
          <h1 className="text-4xl font-bold text-white lg:text-6xl">
            IEEE YESS'25
          </h1>
          <p className="text-lg text-white lg:text-2xl ">
            Yearly Engineering Students Summit
          </p>
          <p className="max-w-2xl text-sm lg:text-base text-white/80 nunito-sans-body">
            Registrations are closed!. See you at NIT Calicut on 20th September
          </p>
          {/* Event Location and Date - Single Line */}
          <div className="flex flex-col items-center justify-center gap-2 mb-2 text-sm sm:flex-row sm:gap-6 text-white/90 sm:text-base lg:text-lg">
            <span className="flex items-center gap-1">
              <FiMapPin className="inline-block text-[#fe4a56]" />
              <span>NIT Calicut, Kerala</span>
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar className="inline-block text-[#fe4a56]" />
              <span>20 September 2025</span>
            </span>
          </div>
          <div className="pt-2">
            
            <div className="mt-3">
              <button
                type="button"
                className="text-base underline transition-colors duration-200 text-white/70 hover:text-white"
                onClick={onOpenCheckStatus}>
                Check Registration Status
              </button>
              <p className="text-sm text-gray-300">Ticket Swapping is available now!!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
