import React, { useState, useCallback } from 'react';
import BgAnimation from '../components/BgAnimation';
import TicketForm from '../components/TicketForm';

function Tickets() {
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Handler to open popup (for SubFooter)
  const handleContactClick = useCallback(() => setShowContactPopup(true), []);
  const handleCloseContactPopup = useCallback(() => setShowContactPopup(false), []);

  return (
    <>
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="relative min-h-screen flex flex-col bg-white-5">
        {/* <Header /> */}
        <main className="flex-grow flex items-center justify-center pt-18 px-4 pb-2 md:pt-16">
          <TicketForm />
        </main>
        {/* <SubFooter 
          onContactClick={handleContactClick}
          isContactPopupOpen={showContactPopup}
          onCloseContactPopup={handleCloseContactPopup}
        /> */}
      </div>
      {/* <ContactPopup isOpen={showContactPopup} onClose={handleCloseContactPopup} /> */}
    </>
  );
}

export default Tickets;
