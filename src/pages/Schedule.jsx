import React, { useState, useEffect, useCallback } from "react";
import BgAnimation from "../components/BgAnimation";
import Header2 from "../components/Header2";

function Schedule() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const landingHeight = window.innerHeight;

      if (scrollPosition > landingHeight * 0.5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="relative z-10 w-full">
        <Header2 isScrolled={isScrolled} onNavigate={scrollToSection} />
        <div className="md:mt-20 mt-15 min-h-screen  bg-black/20 backdrop-blur-xs [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-500/70">
          <div className="flex flex-col items-center justify-center w-full h-full min-h-screen px-5 py-20 sm:px-8 md:px-15">
            <h1 className="mb-4 text-3xl font-bold">SCHEDULE</h1>

            <div className="flex items-center justify-center w-full h-full p-1 border border-red-500 grow bg-color3">
              {/* IFrame displaying the schedule document */}
              <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0ecLrgPu0NczVK2CvTxjsQ2Evgxfyq44HNFpZcVV0qyXr2jYA3QncLVtDe00-2Rs0FLyHHkW8exeK/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false" width={"100%"} height={'750px'}></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
