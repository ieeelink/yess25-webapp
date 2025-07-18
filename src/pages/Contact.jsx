import React from "react";
import BgAnimation from '../components/BgAnimation';
import Header2 from '../components/Header2';
import { FaYoutube, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const socialLinks = [
  {
    href: 'https://www.youtube.com/@IEEEYESS',
    label: 'YouTube',
    icon: <FaYoutube className="w-8 h-8" />,
  },
  {
    href: 'https://www.linkedin.com/company/ieeeyess',
    label: 'LinkedIn',
    icon: <FaLinkedin className="w-8 h-8" />,
  },
  {
    href: 'https://www.instagram.com/ieeeyess',
    label: 'Instagram',
    icon: <FaInstagram className="w-8 h-8" />,
  },
  {
    href: 'https://whatsapp.com/channel/0029VaeZIV217En1T1i38Y1X',
    label: 'WhatsApp',
    icon: <FaWhatsapp className="w-8 h-8" />,
  },
];

const Contact = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
    <div className="fixed inset-0 z-0">
      <BgAnimation />
    </div>
    <div className="w-full relative z-10">
      <Header2 />
      <div className="md:mt-20 mt-15 min-h-screen bg-black/20 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-20 max-w-xl w-full text-center relative">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h1>
          <div className="mb-6">
            <div className="text-lg text-gray-800 mb-2">Email us at:</div>
            <a href="mailto:ieeeyess2025@gmail.com" className="text-xl font-semibold text-[#fe4a56] break-all">ieeeyess2025@gmail.com</a>
          </div>
          <div className="text-lg text-gray-800 mb-3">Follow us on social media:</div>
          <div className="flex justify-center gap-4 mt-2">
            {socialLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#fe4a56] rounded-full p-3 flex items-center justify-center hover:bg-[#e32b2b] transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contact; 