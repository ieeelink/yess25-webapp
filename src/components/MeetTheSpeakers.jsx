import React from 'react';

const MeetTheSpeakers = () => {

  const speakers = [
    {
      id: 1,
      name: "Muhammed Fuwad PK",
      position: "Leader, Friends of Figma Kozhikode",
      image: "/images/speaker1.jpg",
      description: "Product Designer at IOCOD Infotech Pvt. Ltd."
    },
    {
      id: 2,
      name: "Mishal Aboobacker",
      position: "Co - Organizer, Friends of Figma Kozhikode",
      image: "/images/speaker3.jpg",
      description: "UX Designer at Aufait Technologies Pvt. Ltd."
    },
    {
      id: 3,
      name: "Hafis CP",
      position: "Co - Organizer, Friends of Figma Kozhikode",
      image: "/images/speaker2.jpg",
      description: "Product Generalist at MakeMyPass"
    }
  ];

  return (
    <div id="speakers" className="w-full backdrop-blur-sm">
      <div className="w-full py-16 flex flex-col items-center justify-center relative z-10 bg-black/20">
        <div className="w-full px-4 lg:px-12 md:px-6 flex flex-col min-h-0 flex-1" style={{maxWidth: 'min(1600px, 100vw)'}}>
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-[#FE4A56] mb-4">
            Meet the Speakers
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Get inspired by thought leaders and innovators shaping the future.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-[#FE4A56]/50 transition-all duration-300 hover:transform hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Speaker Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#FE4A56]/20 group-hover:border-[#FE4A56] transition-all duration-300">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to a placeholder if image doesn't exist
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=FE4A56&color=fff&size=128`;
                    }}
                  />
                </div>
                {/* Decorative element */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FE4A56] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Speaker Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FE4A56] transition-colors duration-300">
                  {speaker.name}
                </h3>
                <p className="text-[#FE4A56] font-semibold mb-3 text-sm">
                  {speaker.position}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {speaker.description}
                </p>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FE4A56]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        </div>
      </div>
    </div>
  );
};

export default MeetTheSpeakers;
