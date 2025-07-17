import React from 'react';

const AboutSection = () => (
  <div className="w-screen backdrop-blur-sm">
    <div id="about" className="w-full min-h-screen flex flex-col items-center justify-center relative z-10 bg-black/20 pt-4">
      <div className="w-full px-4 lg:px-8 md:px-6 flex flex-col min-h-0 flex-1" style={{maxWidth: 'min(1600px, 100vw)'}}>
        {/* About YESS Section - Desktop Layout */}
        <div className="hidden lg:flex lg:gap-8 lg:mb-12">
          {/* Left Div - YESS Images */}
          <div className="w-1/2 flex items-center justify-center">
            <div className="w-full h-72 flex items-center justify-center relative">
              <div className="relative flex items-center justify-center">
                <div className="w-1/3 min-w-[180px] max-w-xs aspect-square group flex-shrink-0 z-10 mt-0 hover:z-[9999] transition-all duration-300 hover:scale-115">
                  <img src="/poster1.webp" alt="YESS Poster 1" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                </div>
                <div className="w-1/3 min-w-[180px] max-w-xs aspect-square group flex-shrink-0 -ml-16 z-20 mt-8 hover:z-[9999] transition-all duration-300 hover:scale-115">
                  <img src="/poster3.webp" alt="YESS Poster 2" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                </div>
                <div className="w-1/3 min-w-[180px] max-w-xs aspect-square group flex-shrink-0 -ml-16 z-10 mt-16 hover:z-[9999] transition-all duration-300 hover:scale-115">
                  <img src="/poster2.webp" alt="YESS Poster 3" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
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
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="w-full mb-6">
              <div className="flex w-full justify-center gap-8">
                <div className="w-1/2 min-w-[80px] max-w-xs aspect-video group flex-shrink-0 transition-all duration-300 hover:scale-115 hover:z-[9999]">
                  <img src="/nit_college.png" alt="NIT Calicut 1" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                </div>
                <div className="w-1/2 min-w-[80px] max-w-xs aspect-video group flex-shrink-0 transition-all duration-300 hover:scale-115 hover:z-[9999]">
                  <img src="/nitc2.png" alt="NIT Calicut 2" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                </div>
              </div>
              <div className="flex w-full justify-center mt-4">
                <div className="w-2/3 min-w-[80px] max-w-xs aspect-video group flex-shrink-0 transition-all duration-300 hover:scale-115 hover:z-[9999]">
                  <img src="/nitc1.webp" alt="NIT Calicut 3" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
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
            {/* 2-row, 2+1 image layout for mobile */}
            <div className="w-full mb-6">
              <div className="flex w-full justify-center gap-4">
                <div className="w-1/2 min-w-[140px] max-w-md aspect-video group flex-shrink-0 transition-all duration-300 hover:scale-105 hover:z-[9999]">
                  <img src="/nit_college.png" alt="NIT Calicut 1" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                </div>
                <div className="w-1/2 min-w-[140px] max-w-md aspect-video group flex-shrink-0 transition-all duration-300 hover:scale-105 hover:z-[9999]">
                  <img src="/nitc2.webp" alt="NIT Calicut 2" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                </div>
              </div>
              <div className="flex w-full justify-center mt-4">
                <div className="w-2/3 min-w-[140px] max-w-md aspect-video group flex-shrink-0 transition-all duration-300 hover:scale-105 hover:z-[9999]">
                  <img src="/nitc1.webp" alt="NIT Calicut 3" className="w-full h-full object-cover rounded-lg drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] transition-all duration-300" />
                </div>
              </div>
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
    </div>
  </div>
);

export default AboutSection; 