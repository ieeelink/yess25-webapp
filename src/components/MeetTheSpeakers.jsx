import React from "react";

const MeetTheSpeakers = () => {
  const speakers = [
    {
      id: 1,
      name: "Muhammed Fuwad PK",
      position: "Leader, Friends of Figma Kozhikode",
      image: "/images/speaker1.jpg",
      description: "Product Designer at IOCOD Infotech Pvt. Ltd.",
    },
    {
      id: 2,
      name: "Mishal Aboobacker",
      position: "Co - Organizer, Friends of Figma Kozhikode",
      image: "/images/speaker3.jpg",
      description: "UX Designer at Aufait Technologies Pvt. Ltd.",
    },
    {
      id: 3,
      name: "Hafis CP",
      position: "Co - Organizer, Friends of Figma Kozhikode",
      image: "/images/speaker2.jpg",
      description: "Product Generalist at MakeMyPass",
    },
    {
      id: 4,
      name: "Arun A V",
      position: "Execom member IEEE CASS KERALA Chapter",
      image: "/images/speaker4.webp",
      description: "",
    },
    {
      id: 6,
      name: "Anil Antony",
      position: "Academic Coordinator, Sensors Council Kerala Chapter",
      image: "/images/speaker6.webp",
      description: "",
    },
    {
      id: 7,
      name: "Dr. Jose Joseph",
      position: "Vice Chair - Academia, Sensors Council Kerala Chapter",
      image: "/images/speaker7.webp",
      description: "",
    },
    {
      id: 8,
      name: "Sreenivas Pai K",
      position: "Joint Secretary, Sensors Council Kerala Chapter",
      image: "/images/speaker8.webp",
      description: "",
    },
    {
      id: 9,
      name: "Mr. Arshif",
      position: "Founder / CEO of Dronimagination",
      image: "/images/speaker9.webp",
      description: "",
    },
    {
      id: 10,
      name: "Dr Apren TJ",
      position: "President, NeST SFO Technologies, Tvm",
      image: "/images/speaker10.webp",
      description: "",
    },
    {
      id: 11,
      name: "Goutham Rajesh",
      position: "Product Analyst - Cuebo AI",
      image: "/images/speaker11.webp",
      description: "",
    },
    {
      id: 5,
      name: "Shone Jose",
      position: "Chair, Sensors Council Kerala Chapter",
      image: "/images/speaker5.webp",
      description: "",
    },
    {
      id: 12,
      name: "Abimel S B kulumala",
      position: "Co-Founder, TokEnomic Labs, Cybersecurity Consultant",
      description: "",
      image: "/images/speaker12.webp",
    },
    {
      id: 12,
      name: "Dr Sudeendra Koushik",
      position:
        "President Elect - IEEE TEMS | Chief Innovator & Founder - Innovation by Design",
      description: "",
      image: "/images/speaker13.jpg",
    },
  ];

  return (
    <div id="speakers" className="w-full backdrop-blur-sm">
      <div className="relative z-10 flex flex-col items-center justify-center w-full py-16 bg-black/20">
        <div
          className="flex flex-col flex-1 w-full min-h-0 px-4 lg:px-12 md:px-6"
          style={{ maxWidth: "min(1600px, 100vw)" }}>
          {/* Section Header */}
          <div className="mb-16 text-center" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#FE4A56] mb-4">
              Meet the Speakers
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-300">
              Get inspired by thought leaders and innovators shaping the future.
            </p>
          </div>

          {/* Speakers Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker, index) => (
              <div
                key={speaker.id}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-[#FE4A56]/50 transition-all duration-300 hover:transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                {/* Speaker Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#FE4A56]/20 group-hover:border-[#FE4A56] transition-all duration-300">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to a placeholder if image doesn't exist
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          speaker.name
                        )}&background=FE4A56&color=fff&size=128`;
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
                  <p className="text-sm leading-relaxed text-gray-300">
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
