import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BgAnimation from '../components/BgAnimation';
import Header2 from "../components/Header2"
import InfiniteScroll from '../components/InfiniteScroll';
import NewFooter from '../components/NewFooter';
import { FiArrowLeft, FiArrowRight, FiMapPin, FiCalendar } from 'react-icons/fi';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const Home2 = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const partnerImages = [
    '/IEEE.png',
    '/KS White.png',
    '/LINK White.png',
    '/nitc.png',
  ];

  const highlightImages = [
    {
      src: '/images/Highlight21.jpeg',
      alt: 'Inaugration',
    },
    {
      src: '/images/Highlight20.jpeg',
      alt: 'The Dignitaries',
    },
    {
      src: '/images/Highlight1.webp',
      alt: "Drone and RC Car Show",
    },
    {
      src: '/images/Highlight9.webp',
      alt: 'INARA: When Fashion meets Technology',
    },
    {
      src: '/images/Highlight10.jpeg',
      alt: "INARA: The world's first AI-designed, VR-powered fashion show",
    },
    {
      src: '/images/Highlight6.webp',
      alt: "Automotive Expo by VTS Kerala Chapter",
    },
    {
      src: '/images/Highlight12.jpeg',
      alt: 'Industry Mentoring Program',
    },
    {
      src: '/images/Highlight13.jpeg',
      alt: 'Industry Mentoring Program',
    },
    {
      src: '/images/Highlight18.jpeg',
      alt: 'Steel and Motion Expo by IEEE RAS Kerala Chapter',
    },
    {
      src: '/images/Highlight19.jpeg',
      alt: 'Assistive Technology Makethon',
    },
    {
      src: '/images/Highlight2.webp',
      alt: "LINK Team 2024",
    },
    {
      src: '/images/Highlight5.webp',
      alt: 'Crazy Vibes...',
    },
  ];

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const landingHeight = window.innerHeight; // Height of the landing section
      
      if (scrollPosition > landingHeight * 0.5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation state when component mounts
  useEffect(() => {
    // Check if this is a page refresh (no navigation state) vs redirect from another page
    const isPageRefresh = !location.state && !sessionStorage.getItem('hasNavigated');
    
    if (isPageRefresh) {
      // On page refresh, scroll to landing section
      setTimeout(() => {
        scrollToSection('landing');
      }, 100);
    } else if (location.state?.section) {
      // When redirected from another page with specific section
      setTimeout(() => {
        scrollToSection(location.state.section);
      }, 100);
      // Mark that we've navigated to prevent this from running on refresh
      sessionStorage.setItem('hasNavigated', 'true');
    } else if (location.state?.scrollToFooter) {
      // When redirected from another page to scroll to footer
      setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Mark that we've navigated to prevent this from running on refresh
      sessionStorage.setItem('hasNavigated', 'true');
    }
  }, [location.state]);

  // Clear navigation flag when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('hasNavigated');
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
        {/* Background Animation */}
        <div className="fixed inset-0 z-0">
          <BgAnimation />
        </div>
        <Header2 isScrolled={isScrolled} onNavigate={scrollToSection}/>
        
        {/* Viewport-sized container */}
        <div className="w-full h-screen relative z-10">
        <div id="landing" className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center px-4 space-y-4">
            {/* YESS Logo - Only visible on desktop */}
            <div className=" mb-8">
            <img 
                src="/yess_icon.svg" 
                alt="IEEE YESS Logo" 
                className="w-32 lg:w-40 h-auto"
            />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white">IEEE YESS'25</h1>
            <p className="text-lg lg:text-2xl text-white ">Yearly Engineering Students Summit</p>
            <p className="text-sm lg:text-base text-white/80 max-w-2xl nunito-sans-body">Join us for the most anticipated engineering summit of the year</p>
            {/* Event Location and Date - Single Line */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mb-2 text-white/90 text-sm sm:text-base lg:text-lg">
              <span className="flex items-center gap-1"><FiMapPin className="inline-block text-[#fe4a56]" /><span>NIT Calicut, Kerala</span></span>
              <span className="flex items-center gap-1"><FiCalendar className="inline-block text-[#fe4a56]" /><span>20 September 2025</span></span>
            </div>
            <div className="pt-2">
            <Link 
                // to="/tickets" 
                className="inline-block px-12 py-4 text-xl bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-110"
            >
                Coming Soon...
            </Link>
            </div>
            {/* Secondary link for registration details or retry payment */}
            {/* <div className="pt-2">
            <Link
                to="/checkStatus"
                className="inline-block text-base text-white/80 underline hover:text-white transition-all duration-200"
            >
                Get Registration Details / Retry Payment
            </Link>
            </div> */}
        </div>
        </div>
      </div>

      {/* Infinite Scroll Section */}
      <div className="w-full relative z-10 py-8">
        <InfiniteScroll images={partnerImages} />
      </div>

      {/* Explore Events Section */}
      <div id="events" className="w-full backdrop-blur-xs">
        <div className="w-full py-16 flex flex-col items-center justify-center relative z-10 bg-black/20">
          <div className="w-full px-4 lg:px-8 md:px-6 flex flex-col min-h-0 flex-1" style={{maxWidth: 'min(1600px, 100vw)'}}>
            <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center py-12">
              {/* Left: Text Content */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-0">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Explore Events</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Discover What Awaits You</h2>
                <p className="mb-6 text-base nunito-sans-body leading-relaxed">
                  IEEE YESS'25 brings you an exciting lineup of events designed to inspire, educate, and connect engineering students from across India. From technical workshops to networking sessions, there's something for everyone.
                </p>
                <Link 
                  className="inline-block px-8 py-3 text-lg bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-105"
                >
                  Coming Soon...
                </Link>
              </div>
              
              {/* Right: Images Grid */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:py-8">
                {/* <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="space-y-4">
                    <div className="relative group overflow-hidden rounded-lg shadow-2xl">
                      <img 
                        src="/images/Highlight1.webp" 
                        alt="Technical Workshop" 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">Technical Workshop</p>
                      </div>
                    </div>
                    
                    <div className="relative group overflow-hidden rounded-lg shadow-2xl">
                      <img 
                        src="/images/Highlight6.webp" 
                        alt="Industry Expo" 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">Industry Expo</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-8">
                    <div className="relative group overflow-hidden rounded-lg shadow-2xl">
                      <img 
                        src="/images/Highlight9.webp" 
                        alt="Competitions" 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">Competitions</p>
                      </div>
                    </div>
                    
                    <div className="relative group overflow-hidden rounded-lg shadow-2xl">
                      <img 
                        src="/images/Highlight12.jpeg" 
                        alt="Networking" 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">Networking</p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section Content */}
      <div className="w-screen backdrop-blur-sm">
        <div id="about" className="w-full min-h-screen flex flex-col items-center justify-center relative z-10 bg-black/20 pt-4">
          <div className="w-full px-4 lg:px-8 md:px-6 flex flex-col min-h-0 flex-1" style={{maxWidth: 'min(1600px, 100vw)'}}>
          {/* About YESS Section - Desktop Layout */}
          <div className="hidden lg:flex lg:gap-8 lg:mb-12">
            {/* Left Div - YESS Images */}
            <div className="w-1/2 flex items-center justify-center">
              <div className="w-full h-72 flex items-center justify-center relative">
                <div className="relative flex items-center justify-center">
                  <div className="w-1/3 min-w-[180px] max-w-xs h-72 hover:w-full hover:h-full group flex-shrink-0 z-10 mt-0 hover:z-[9999] transition-all duration-300">
                    <img src="/poster1.webp" alt="YESS Poster 1" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:scale-105 transition-all duration-300" />
                  </div>
                  <div className="w-1/3 min-w-[180px] max-w-xs h-72 group hover:w-full hover:h-full flex-shrink-0 -ml-16 z-20 mt-8 hover:z-[9999] transition-all duration-300">
                    <img src="/poster3.webp" alt="YESS Poster 2" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:scale-105 transition-all duration-300" />
                  </div>
                  <div className="w-1/3 min-w-[180px] max-w-xs h-72 group hover:w-full hover:h-full flex-shrink-0 -ml-16 z-10 mt-16 hover:z-[9999] transition-all duration-300">
                    <img src="/poster2.webp" alt="YESS Poster 3" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:scale-105 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Div - About YESS Text */}
            <div className="w-1/2 flex flex-col justify-center">
              <div className="w-full">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">About YESS</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Yearly Engineering Students Summit</h2>
                <p className="text-white text-base nunito-sans-body leading-relaxed">
                  IEEE YESS'25, the largest engineering students summit by IEEE, is a collaborative initiative of IEEE LINK and IEEE Kerala Section. Set to take place on September 20th at NIT Calicut, this summit will bring together over 5,000 participants from across India, creating a platform for students to connect with industry professionals and enhance their professional development.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Two equal width divs side by side */}
          <div className="hidden lg:flex lg:gap-8 lg:mb-12 py-16">
            {/* Left Div - Our Host */}
            <div className="w-1/2 flex flex-col justify-center">
              {/* Our Host Section */}
              <div className="w-full">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Our Host</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">National Institute of Technology Calicut</h2>
                
                <p className="text-white text-base nunito-sans-body leading-relaxed">
                  National Institute of Technology Calicut (NITC), established in 1961, is a premier technical institution under the Ministry of Education, Government of India. Renowned for excellence in engineering and research, NITC offers comprehensive undergraduate, postgraduate, and doctoral programs. Consistently ranked among India's top engineering colleges, it provides a nurturing environment for academic excellence and innovation.
                </p>
              </div>
            </div>

            {/* Right Div - NIT Calicut Images (like About YESS) */}
            <div className="w-1/2 flex items-center justify-center">
              <div className="w-full h-56 aspect-video flex items-center justify-center relative">
                <div className="relative flex items-center justify-center w-full h-full">
                  <div className="w-1/3 min-w-[220px] max-w-md h-56 aspect-video group flex-shrink-0 z-10 mt-0 transition-all duration-300 hover:w-full hover:h-80 hover:scale-110 hover:z-[9999]">
                    <img src="/nit_college.png" alt="NIT Calicut 1" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                  </div>
                  <div className="w-1/3 min-w-[220px] max-w-md h-56 aspect-video group flex-shrink-0 -ml-16 z-20 mt-8 transition-all duration-300 hover:w-full hover:h-80 hover:scale-110 hover:z-[9999]">
                    <img src="/nitc1.webp" alt="NIT Calicut 2" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                  </div>
                  <div className="w-1/3 min-w-[220px] max-w-md h-56 aspect-video group flex-shrink-0 -ml-16 z-10 mt-16 transition-all duration-300 hover:w-full hover:h-80 hover:scale-110 hover:z-[9999]">
                    <img src="/nitc2.webp" alt="NIT Calicut 3" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* About IEEE LINK Section - Desktop Layout (Normal Layout, No Image) */}
          <div className="hidden lg:block lg:mb-12">
            <div className="w-full">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">About IEEE LINK</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Local Integrated Network of Kerala IEEE Students</h2>
              <p className="text-white text-base nunito-sans-body leading-relaxed">
                IEEE LINK (Local Integrated Network of Kerala IEEE Students) is a unique initiative by the IEEE Kerala Section, designed to connect and empower IEEE student branches across the state. Established in 2000, LINK acts as a bridge between students and professionals, facilitating leadership development, technical training, and collaborative projects. Members also gain access to a vibrant community, mentorship, and exciting opportunities.
              </p>
            </div>
          </div>

          <div className="hidden lg:flex lg:gap-8 lg:mb-12 py-16">
            {/* Left Div - About IEEE Text */}
            <div className="w-1/2 flex flex-col justify-center">
              <div className="w-full">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">About IEEE</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Institute of Electrical and Electronics Engineers</h2>
                <p className="text-white text-base nunito-sans-body leading-relaxed">
                  IEEE (Institute of Electrical and Electronics Engineers) is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity. With over 400,000 members in more than 160 countries, IEEE fosters innovation, education, and collaboration through conferences, publications, and standards.
                </p>
              </div>
            </div>
            {/* Right Div - About IEEE Kerala Section Text */}
            <div className="w-1/2 flex flex-col justify-center">
              <div className="w-full">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">About IEEE Kerala Section</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">IEEE Kerala Section</h2>
                <p className="text-white text-base nunito-sans-body leading-relaxed">
                  IEEE Kerala Section, established in 1983, is one of the most active and innovative sections of IEEE in India. It serves as the regional hub for IEEE activities in Kerala, supporting over 10,000 members including professionals, academicians, and students. The section is renowned for its dynamic student network, technical conferences, workshops, and humanitarian initiatives.
                </p>
              </div>
            </div>
            
          </div>
          {/* Mobile Layout - Responsive version of desktop structure */}
          <div className="lg:hidden">
            {/* About YESS Section - Mobile */}
            <div className="w-full mb-12">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">About YESS</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Yearly Engineering Students Summit</h2>
              {/* YESS Posters - Mobile */}
              <div className="w-full h-56 mb-6 flex items-center justify-center relative">
                <div className="relative flex items-center justify-center">
                  <div className="w-1/3 min-w-[120px] max-w-xs h-56 group flex-shrink-0 z-10 mt-0">
                    <img src="/poster1.webp" alt="YESS Poster 1" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:z-30 hover:scale-105 transition-all duration-300" />
                  </div>
                  <div className="w-1/3 min-w-[120px] max-w-xs h-56 group flex-shrink-0 -ml-10 z-20 mt-6">
                    <img src="/poster3.webp" alt="YESS Poster 2" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:z-30 hover:scale-105 transition-all duration-300" />
                  </div>
                  <div className="w-1/3 min-w-[120px] max-w-xs h-56 group flex-shrink-0 -ml-10 z-10 mt-12">
                    <img src="/poster2.webp" alt="YESS Poster 3" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:z-30 hover:scale-105 transition-all duration-300" />
                  </div>
                </div>
              </div>
              <p className="text-white text-base nunito-sans-body leading-relaxed">
                IEEE YESS'25, the largest engineering students summit by IEEE, is a collaborative initiative of IEEE LINK and IEEE Kerala Section. Set to take place on September 20th at NIT Calicut, this summit will bring together over 5,000 participants from across India, creating a platform for students to connect with industry professionals and enhance their professional development.
              </p>
            </div>

            {/* Our Host Section - Mobile */}
            <div className="w-full mb-12">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Our Host</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">National Institute of Technology Calicut</h2>
              <div className="w-full relative group mb-6">
                <img 
                  src="/nit_college.png" 
                  alt="NIT Calicut" 
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:drop-shadow-[0_8px_16px_rgba(31,41,55,0.9)] hover:scale-105 transition-all duration-300 rounded-2xl"
                />
              </div>
              <p className="text-white text-base nunito-sans-body leading-relaxed">
                National Institute of Technology Calicut (NITC), established in 1961, is a premier technical institution under the Ministry of Education, Government of India. Renowned for excellence in engineering and research, NITC offers comprehensive undergraduate, postgraduate, and doctoral programs. Consistently ranked among India's top engineering colleges, it provides a nurturing environment for academic excellence and innovation.
              </p>
            </div>

            {/* About IEEE LINK Section - Mobile */}
            <div className="w-full mb-12">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">About IEEE LINK</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Local Integrated Network of Kerala IEEE Students</h2>
              <p className="text-white text-base nunito-sans-body leading-relaxed">
                IEEE LINK (Local Integrated Network of Kerala IEEE Students) is a unique initiative by the IEEE Kerala Section, designed to connect and empower IEEE student branches across the state. Established in 2000, LINK acts as a bridge between students and professionals, facilitating leadership development, technical training, and collaborative projects. Members also gain access to a vibrant community, mentorship, and exciting opportunities.
              </p>
            </div>

            {/* About IEEE Section - Mobile */}
            <div className="w-full mb-12">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">About IEEE</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Institute of Electrical and Electronics Engineers</h2>
              <p className="text-white text-base nunito-sans-body leading-relaxed">
                IEEE (Institute of Electrical and Electronics Engineers) is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity. With over 400,000 members in more than 160 countries, IEEE fosters innovation, education, and collaboration through conferences, publications, and standards.
              </p>
            </div>

            {/* About IEEE Kerala Section - Mobile */}
            <div className="w-full mb-12">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">About IEEE Kerala Section</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">IEEE Kerala Section</h2>
              <p className="text-white text-base nunito-sans-body leading-relaxed">
                IEEE Kerala Section, established in 1983, is one of the most active and innovative sections of IEEE in India. It serves as the regional hub for IEEE activities in Kerala, supporting over 10,000 members including professionals, academicians, and students. The section is renowned for its dynamic student network, technical conferences, workshops, and humanitarian initiatives.
              </p>
            </div>
          </div>
        </div>
        {/* Highlights Section - Side by Side */}
        <div id="highlights" className="w-full flex justify-center pb-16">
          <div className="w-full px-4 lg:px-8 md:px-6" style={{maxWidth: 'min(1600px, 100vw)'}}>
            <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center py-12">
              {/* Left: Heading, images, text, button (mobile: images between headings and text) */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-0">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Highlights'24</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Largest Engineering Student's meet in Kerala</h2>
                {/* SwiperJS Carousel - Mobile */}
                <div className="w-full h-64 mb-6 lg:hidden relative">
                  <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    loop={true}
                    loopAdditionalSlides={2}
                    speed={800}
                    breakpoints={{
                      320: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                        coverflowEffect: {
                          rotate: 0,
                          stretch: 0,
                          depth: 30,
                          modifier: 1,
                          slideShadows: false,
                        }
                      },
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                        coverflowEffect: {
                          rotate: 0,
                          stretch: 0,
                          depth: 40,
                          modifier: 1,
                          slideShadows: false,
                        }
                      }
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    navigation={{
                      nextEl: '.swiper-button-next-mobile',
                      prevEl: '.swiper-button-prev-mobile',
                    }}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: false,
                    }}
                    modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                    className="h-full"
                  >
                    {highlightImages.map((image, index) => (
                      <SwiperSlide key={index} className="w-full h-64">
                        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="text-white text-sm font-medium">{image.alt}</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Custom Navigation Buttons - Mobile */}
                  <div className="absolute top-1/2 left-2 right-2 transform -translate-y-1/2 z-20 flex justify-between pointer-events-none">
                    <button className="swiper-button-prev-mobile custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm group pointer-events-auto">
                      <FiArrowLeft className="w-4 h-4 text-red-500 group-hover:text-white transition-colors duration-300" />
                    </button>
                    <button className="swiper-button-next-mobile custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm group pointer-events-auto">
                      <FiArrowRight className="w-4 h-4 text-red-500 group-hover:text-white transition-colors duration-300" />
                    </button>
                  </div>
                </div>
                <p className="mb-4 text-base nunito-sans-body leading-relaxed">
                  The 1-day event predominantly provided an opportunity for the student community to meet highly intelligent and motivated peers, enhanced their skills through trainings, workshops, and competitions, and geared them up to face the professional career ahead of them.
                </p>
                <ul className="list-disc list-inside text-base space-y-2 nunito-sans-body">
                  <li>Largest student meet of IEEE Kerala Section</li>
                  <li>Sessions led by pioneers of the industry</li>
                  <li>Competitions to prove your mettle</li>
                  <li>Broaden your network with industry experts</li>
                  <li>Opportunity to meet like-minded people</li>
                </ul>

              </div>
              {/* Right: SwiperJS Carousel (desktop only) */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:py-8 pt-12 lg:pt-8 overflow-visible hidden lg:flex">
                <div className="relative w-full h-96 lg:h-[400px]">
                  <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    loop={true}
                    loopAdditionalSlides={2}
                    speed={800}
                    breakpoints={{
                      1024: {
                        slidesPerView: 'auto',
                        spaceBetween: 30,
                        coverflowEffect: {
                          rotate: 30,
                          stretch: 0,
                          depth: 80,
                          modifier: 1,
                          slideShadows: true,
                        }
                      },
                      1280: {
                        slidesPerView: 'auto',
                        spaceBetween: 40,
                        coverflowEffect: {
                          rotate: 50,
                          stretch: 0,
                          depth: 100,
                          modifier: 1,
                          slideShadows: true,
                        }
                      }
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    navigation={{
                      nextEl: '.swiper-button-next-desktop',
                      prevEl: '.swiper-button-prev-desktop',
                    }}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: false,
                    }}
                    modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                    className="h-full"
                  >
                    {highlightImages.map((image, index) => (
                      <SwiperSlide key={index} className="w-[80%] lg:w-[75%] xl:w-[70%] h-96 lg:h-[400px]">
                        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <p className="text-white text-base lg:text-lg font-medium">{image.alt}</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Custom Navigation Buttons - Desktop */}
                  <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 z-20 flex justify-between">
                    <button className="swiper-button-prev-desktop custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group">
                      <FiArrowLeft className="w-5 h-5 text-red-500 group-hover:text-white transition-colors duration-300" />
                    </button>
                    <button className="swiper-button-next-desktop custom-swiper-button bg-white/30 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group">
                      <FiArrowRight className="w-5 h-5 text-red-500 group-hover:text-white transition-colors duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
    <style>{`
      /* Custom Scrollbar Styles */
      ::-webkit-scrollbar {
        width: 12px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #fe4a56 0%, #ea1212 100%);
        border-radius: 10px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #ea1212 0%, #fe4a56 100%);
        transform: scale(1.05);
      }
      
      ::-webkit-scrollbar-thumb:active {
        background: linear-gradient(180deg, #d41010 0%, #ea1212 100%);
      }
      
      /* Firefox Scrollbar */
      * {
        scrollbar-width: thin;
        scrollbar-color: #fe4a56 rgba(0, 0, 0, 0.1);
      }
      
      /* Smooth scrolling for the entire page */
      html {
        scroll-behavior: smooth;
      }
      
      /* Swiper Styles */
      .swiper {
        width: 100%;
        height: 100%;
        padding-top: 0;
        padding-bottom: 0;
      }
      
      .swiper-slide {
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
      }
      
      .swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
      }
      
      .custom-swiper-button {
        position: static !important;
        width: 36px !important;
        height: 36px !important;
        margin: 0 !important;
        z-index: 30 !important;
      }
      
      @media (min-width: 640px) {
        .custom-swiper-button {
          width: 42px !important;
          height: 42px !important;
        }
      }
      
      @media (min-width: 768px) {
        .custom-swiper-button {
          width: 48px !important;
          height: 48px !important;
        }
      }
      
      .custom-swiper-button::after {
        display: none;
      }
      
      .swiper-pagination-bullet {
        background: #FE4A56 !important;
      }
      
      .swiper-pagination-bullet-active {
        background: #FE4A56 !important;
      }
    `}</style>
    </>
  );
};

export default Home2; 