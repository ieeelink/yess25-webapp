import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import './EventSlider.css';

const EventDetails = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const events = [
    {
      id: 1,
      title: "Keynote Speeches",
      date: "March 15, 2025",
      time: "09:00 AM - 12:00 PM",
      description: "Renowned industry leaders share insights on future engineering trends and innovations.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Main Event",
      location: "Grand Ballroom",
      speakers: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
      highlights: ["Future of AI", "Sustainable Engineering", "Industry 4.0"]
    },
    {
      id: 2,
      title: "Technical Workshops",
      date: "March 15-16, 2025",
      time: "02:00 PM - 05:00 PM",
      description: "Hands-on workshops covering AI, IoT, and sustainable engineering practices.",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Workshop",
      location: "Innovation Lab",
      speakers: ["Dr. Emily Brown", "Prof. David Wilson"],
      highlights: ["AI Implementation", "IoT Development", "Green Tech"]
    },
    {
      id: 3,
      title: "Project Exhibition",
      date: "March 16, 2025",
      time: "10:00 AM - 04:00 PM",
      description: "Showcase of innovative student projects and research work.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Exhibition",
      location: "Exhibition Hall",
      speakers: ["Student Teams", "Industry Experts"],
      highlights: ["Student Projects", "Research Showcase", "Innovation Display"]
    },
    {
      id: 4,
      title: "Networking Session",
      date: "March 16, 2025",
      time: "06:00 PM - 08:00 PM",
      description: "Connect with industry professionals and fellow engineers.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      category: "Networking",
      location: "Sky Lounge",
      speakers: ["Industry Leaders", "Alumni Network"],
      highlights: ["Career Opportunities", "Industry Connections", "Mentorship"]
    },
    {
      id: 5,
      title: "Panel Discussion",
      date: "March 17, 2025",
      time: "11:00 AM - 01:00 PM",
      description: "Expert panel discussion on emerging technologies and career opportunities.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Discussion",
      location: "Conference Room A",
      speakers: ["Dr. James Wilson", "Prof. Lisa Chen"],
      highlights: ["Tech Trends", "Career Growth", "Industry Insights"]
    },
    {
      id: 6,
      title: "Award Ceremony",
      date: "March 17, 2025",
      time: "03:00 PM - 05:00 PM",
      description: "Recognition of outstanding contributions and achievements.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      category: "Ceremony",
      location: "Main Auditorium",
      speakers: ["Dean's Office", "Industry Partners"],
      highlights: ["Student Awards", "Research Recognition", "Innovation Prizes"]
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-white p-4 sm:p-8">
      <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-[#fe4a56] text-center">Event Schedule</h2>
      
      <div className={`relative w-full max-w-7xl mx-auto transition-all duration-600 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          loopAdditionalSlides={2}
          speed={800}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          navigation
          pagination={{ clickable: true }}
          className="w-full [&_.swiper-button-next]:text-[#fe4a56] [&_.swiper-button-prev]:text-[#fe4a56] [&_.swiper-button-next]:bg-[rgba(254,74,86,0.8)] [&_.swiper-button-prev]:bg-[rgba(254,74,86,0.8)] [&_.swiper-button-next]:w-10 [&_.swiper-button-prev]:w-10 [&_.swiper-button-next]:h-10 [&_.swiper-button-prev]:h-10 [&_.swiper-button-next]:rounded-full [&_.swiper-button-prev]:rounded-full [&_.swiper-button-next]:backdrop-blur-sm [&_.swiper-button-prev]:backdrop-blur-sm [&_.swiper-button-next:after]:text-lg [&_.swiper-button-prev:after]:text-lg [&_.swiper-pagination-bullet]:bg-white/30 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-[#fe4a56] [&_.swiper-slide]:w-[85%] md:[&_.swiper-slide]:w-[70%] [&_.swiper-slide-active]:scale-100 [&_.swiper-slide]:scale-90 [&_.swiper-slide]:transition-transform [&_.swiper-slide]:duration-300 [&_.swiper-slide]:border-0 [&_.swiper-slide]:outline-none [&_.swiper-slide]:bg-transparent"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id} className="flex justify-center items-center p-2 sm:p-4">
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] group">
                <div className="relative h-48 sm:h-64">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                  <div className="absolute top-4 right-4 bg-[#fe4a56] px-4 py-2 rounded-full text-sm font-medium">
                    {event.category}
                  </div>
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3 text-[#fe4a56] relative overflow-hidden after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#fe4a56] after:transition-all after:duration-300 group-hover:after:w-full">
                    {event.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-[#fe4a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-300 text-sm sm:text-base">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-[#fe4a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300 text-sm sm:text-base">{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-[#fe4a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-300 text-sm sm:text-base">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-[#fe4a56] mb-1 sm:mb-2">Speakers</h4>
                        <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base">
                          {event.speakers.map((speaker, idx) => (
                            <li key={idx}>{speaker}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-[#fe4a56] mb-1 sm:mb-2">Highlights</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {event.highlights.map((highlight, idx) => (
                            <span 
                              key={idx} 
                              className="bg-gray-800 text-gray-300 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm transition-all duration-300 group-hover:bg-[#fe4a56] group-hover:-translate-y-0.5"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-4 sm:mt-6 text-gray-400 text-sm sm:text-lg leading-relaxed">{event.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default EventDetails; 