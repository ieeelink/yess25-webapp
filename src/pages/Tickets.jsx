import React from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import TicketForm from '../components/TicketForm';

function Tickets() {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="relative min-h-screen flex flex-col bg-white-5">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-18 px-4 pb-2 md:pt-16">
          <TicketForm />
        </main>
        <SubFooter />
      </div>
    </>
  );
}

export default Tickets;
