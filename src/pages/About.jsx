import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 h-screen">
        <h1 className="text-4xl font-bold mb-6 text-white">About Us</h1>
        <div className="max-w-2xl">
          <p className="text-lg text-white mb-4">
            Learn more about our company and mission.
          </p>
          <p className="text-lg text-white">
            We are dedicated to providing innovative solutions and creating meaningful impact in our community.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About; 