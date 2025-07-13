import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaYoutube, FaLinkedin, FaInstagram, FaWhatsapp, FaGlobe } from 'react-icons/fa';

const NewFooter = ({ onShowOverlay }) => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const socialLinks = [
    {
      href: 'https://www.youtube.com/@IEEEYESS',
      label: 'YouTube',
      icon: <FaYoutube className="w-5 h-5" />,
    },
    {
      href: 'https://www.linkedin.com/company/ieeeyess',
      label: 'LinkedIn',
      icon: <FaLinkedin className="w-5 h-5" />,
    },
    {
      href: 'https://www.instagram.com/ieeeyess',
      label: 'Instagram',
      icon: <FaInstagram className="w-5 h-5" />,
    },
    {
      href: 'https://whatsapp.com/channel/0029VaeZIV217En1T1i38Y1X',
      label: 'WhatsApp',
      icon: <FaWhatsapp className="w-5 h-5" />,
    }
  ];

  const ieeeLinks = [
    {
      href: 'https://www.ieee.org',
      label: 'IEEE',
    },
    {
      href: 'https://ieeekerala.org',
      label: 'IEEE Kerala Section',
    },
    {
      href: 'https://ieee-link.org',
      label: 'IEEE LINK',
    }
  ];

  return (
    <>
      <footer className="w-full bg-black/80 backdrop-blur-sm text-white border-t border-gray-800">
        <div className="w-full flex justify-center">
          <div className="w-full px-4 lg:px-8 md:px-6 py-12" style={{maxWidth: 'min(1600px, 100vw)'}}>
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#fe4a56]">Contact Us</h3>
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">Email us at:</p>
                  <a 
                    href="mailto:ieeeyess2025@gmail.com" 
                    className="text-[#fe4a56] hover:text-[#ea1212] font-medium transition-colors"
                  >
                    ieeeyess2025@gmail.com
                  </a>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">Follow us on social media:</p>
                  <div className="flex space-x-3">
                    {socialLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#fe4a56] hover:bg-[#ea1212] text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        title={item.label}
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* IEEE Organizations */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#fe4a56]">IEEE Organizations</h3>
                <div className="space-y-3">
                  {ieeeLinks.map((link) => (
                    <div key={link.label} className="space-y-1">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#fe4a56] font-medium transition-colors flex items-center space-x-2"
                      >
                        <FaGlobe className="w-4 h-4" />
                        <span>{link.label}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#fe4a56]">Quick Links</h3>
                <div className="space-y-2">

                  <Link 
                    to="/checkStatus" 
                    className="block text-gray-300 hover:text-[#fe4a56] transition-colors"
                  >
                    Check Status
                  </Link>
                  <Link 
                    to="/tickets" 
                    className="block text-gray-300 hover:text-[#fe4a56] transition-colors"
                  >
                    Tickets
                  </Link>
                </div>
              </div>

              {/* About YESS */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#fe4a56]">About YESS</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  IEEE YESS'25 is the largest engineering students summit by IEEE, bringing together over 5,000 participants from across India for professional development and networking opportunities.
                </p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                {/* Copyright */}
                <div className="text-center lg:text-left">
                  <button
                    className="bg-transparent border-none p-0 m-0 text-inherit no-underline text-gray-400 transition-colors"
                    onClick={onShowOverlay}
                    type="button"
                  >
                    &copy; {new Date().getFullYear()} IEEE LINK. All rights reserved.
                  </button>
                </div>

                {/* Legal Links */}
                <div className="flex flex-wrap justify-center lg:justify-end space-x-6">
                  <Link 
                    to="/tos" 
                    className="text-gray-400 hover:text-[#fe4a56] transition-colors text-sm"
                  >
                    Terms of Service
                  </Link>
                  <Link 
                    to="/privacy" 
                    className="text-gray-400 hover:text-[#fe4a56] transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default NewFooter; 