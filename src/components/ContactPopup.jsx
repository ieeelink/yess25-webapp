import React, { useEffect, useRef } from 'react';

const socialLinks = [
  {
    href: 'https://www.youtube.com/@IEEEYESS',
    label: 'YouTube',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.12-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.566a2.994 2.994 0 0 0-2.12 2.12C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.12 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.566a2.994 2.994 0 0 0 2.12-2.12C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/ieeeyess',
    label: 'LinkedIn',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/ieeeyess',
    label: 'Instagram',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.981.981-1.213 2.093-1.272 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.291 2.393 1.272 3.374.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.291 3.374-1.272.981-.981 1.213-2.093 1.272-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.291-2.393-1.272-3.374-.981-.981-2.093-1.213-3.374-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    href: 'https://whatsapp.com/channel/0029VaeZIV217En1T1i38Y1X',
    label: 'WhatsApp',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.941 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.172.2-.296.298-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.437-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.994c-.003 5.456-4.438 9.892-9.897 9.892zm8.413-18.282A11.815 11.815 0 0 0 12.048 0C5.495 0 .053 5.441.05 12.092c.002 2.13.557 4.213 1.615 6.044L.057 24l6.262-1.645a11.888 11.888 0 0 0 5.675 1.444h.005c6.553 0 11.994-5.441 11.997-12.092a11.821 11.821 0 0 0-3.488-8.382z"/>
      </svg>
    ),
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
    <div ref={popupRef} className="absolute bottom-full right-0 mb-2 bg-white rounded-lg p-6 shadow-lg w-80">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close popup"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
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