import React, { useEffect, useRef } from 'react';
import { FaYoutube, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const socialLinks = [
  {
    href: 'https://www.youtube.com/@IEEEYESS',
    label: 'YouTube',
    icon: <FaYoutube className="w-6 h-6" />,
  },
  {
    href: 'https://www.linkedin.com/company/ieeeyess',
    label: 'LinkedIn',
    icon: <FaLinkedin className="w-6 h-6" />,
  },
  {
    href: 'https://www.instagram.com/ieeeyess',
    label: 'Instagram',
    icon: <FaInstagram className="w-6 h-6" />,
  },
  {
    href: 'https://whatsapp.com/channel/0029VaeZIV217En1T1i38Y1X',
    label: 'WhatsApp',
    icon: <FaWhatsapp className="w-6 h-6" />,
  }
];

const ContactPopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={popupRef} className="absolute bottom-full right-0 mb-2 bg-white rounded-lg p-6 shadow-lg w-80 z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close popup"
      >
        <MdClose className="w-5 h-5" />
      </button>
      
      <h2 className="text-xl font-bold mb-4 text-gray-800">Contact Us</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 mb-1">Email us at:</p>
          <a href="mailto:ieeeyess2024@gmail.com" className="text-[#fe4a56] hover:text-[#8c0505] font-medium">
            ieeeyess2024@gmail.com
          </a>
        </div>

        <div>
          <p className="text-gray-600 mb-2">Follow us on social media:</p>
          <div className="flex space-x-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#fe4a56] hover:bg-[#8c0505] text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                title={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPopup; 