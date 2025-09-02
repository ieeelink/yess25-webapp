import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SponsorsSection = () => {
  useEffect(() => {
    AOS.refresh();
  }, []);

  // Sponsors data from yesslogo/sponsor folder
  const sponsors = [
    {
      id: 1,
      name: "GeeksforGeeks",
      logo: "/yesslogo/sponsor/GeeksforGeeks logo Sponsor.png",
      website: "https://www.geeksforgeeks.org"
    },
    {
      id: 2,
      name: "SSIT",
      logo: "/yesslogo/sponsor/Sponsor SSIT Logo.png",
      website: "https://ssit.ieee.org"
    }
  ];

  // Collaborators data from yesslogo/collab folder
  const collaborators = [
    {
      id: 1,
      name: "CASS Kerala Chapter",
      logo: "/yesslogo/collab/CASS KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 2,
      name: "ComSoc Kerala Chapter",
      logo: "/yesslogo/collab/ComSoc KC Logo.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 3,
      name: "CRFID Kerala Chapter",
      logo: "/yesslogo/collab/CRFID KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 4,
      name: "CS Kerala Chapter",
      logo: "/yesslogo/collab/CS KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 5,
      name: "IA/IE/PELS Joint Chapter Kerala",
      logo: "/yesslogo/collab/jtChapKC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 6,
      name: "LMGA Kerala",
      logo: "/yesslogo/collab/LMGA Kerala.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 7,
      name: "PES Kerala Chapter",
      logo: "/yesslogo/collab/pes kc.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 8,
      name: "Photonics Kerala Chapter",
      logo: "/yesslogo/collab/Photonics KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 9,
      name: "PIE Kerala Chapter",
      logo: "/yesslogo/collab/PIE KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 10,
      name: "RAS Kerala Chapter",
      logo: "/yesslogo/collab/RAS KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 11,
      name: "Sensors Council Kerala Chapter",
      logo: "/yesslogo/collab/SCKC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 12,
      name: "SPS Kerala Chapter",
      logo: "/yesslogo/collab/SPS KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 13,
      name: "SSCS Kerala Chapter",
      logo: "/yesslogo/collab/SSCS KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 14,
      name: "SSIT Kerala Chapter",
      logo: "/yesslogo/collab/SSIT KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 15,
      name: "VTS Kerala Chapter",
      logo: "/yesslogo/collab/VTS KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 16,
      name: "Young Professionals Kerala Section",
      logo: "/yesslogo/collab/Yp KC.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 17,
      name: "WIE Kerala Section",
      logo: "/yesslogo/collab/WIE KS.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 18,
      name: "SIGHT IEEE Kerala Section",
      logo: "/yesslogo/collab/SIGHT KS.png",
      website: "https://ieee-kerala.org"
    },
    {
      id: 19,
      name: "IEEE R10 Industry Relations Committee",
      logo: "/yesslogo/collab/R10 IRC.png",
      website: "https://www.ieeer10.org/"
    }
  ];

  return (
    <div id="sponsors" className="w-full min-h-screen backdrop-blur-sm">
      <div className="w-full flex pt-10 flex-col items-center justify-center relative z-10 bg-black/30 min-h-screen">
        <div className="w-full md:px-6 flex flex-col min-h-0 flex-1" style={{maxWidth: 'min(1600px, 100vw)'}}>

          {/* Sponsors Subsection */}
          <div className="mb-16" data-aos="fade-up" data-aos-delay="200">
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#fe4a56] mb-4">
                Sponsors
              </h3>
              <div className="w-24 h-1 bg-[#fe4a56] mx-auto rounded-full"></div>
            </div>
            
            {/* Sponsors Grid */}
            <div className="flex flex-wrap justify-center items-center gap-12 max-w-6xl mx-auto">
              {sponsors.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className="group relative transition-transform duration-500 ease-in-out hover:scale-110 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-full h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all duration-300"
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                    {sponsor.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborators Subsection */}
          <div className="mb-8" data-aos="fade-up" data-aos-delay="400">
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#fe4a56] mb-4">
                Collaborators
              </h3>
              <div className="w-24 h-1 bg-[#fe4a56] mx-auto rounded-full"></div>
            </div>
            
            {/* Collaborators Grid */}
            <div className="flex flex-wrap justify-center items-center gap-12 max-w-6xl mx-auto">
              {collaborators.map((collaborator, index) => (
                <div
                  key={collaborator.id}
                  className="group relative transition-transform duration-500 ease-in-out hover:scale-110 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <img
                    src={collaborator.logo}
                    alt={collaborator.name}
                    className="w-full h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all duration-300"
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                    {collaborator.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorsSection;
