import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 h-screen">
        <h1 className="text-4xl font-bold mb-6 text-white">Terms of Service</h1>
        <div className="max-w-2xl">
          <p className="text-lg text-white mb-4">
            Welcome to IEEE YESS. By accessing our website, you agree to these terms of service.
          </p>
          <p className="text-lg text-white">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsOfService; 