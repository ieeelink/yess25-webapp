import React, { useState, useEffect } from 'react';
import BgAnimation from '../components/BgAnimation';
import Header2 from '../components/Header2';

function BulkRegistrationGuidelines() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const landingHeight = window.innerHeight;

      if (scrollPosition > landingHeight * 0.5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const GuidelinesContent = () => (
    <div className="prose prose-lg max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Bulk Registration Guidelines & Terms</h1>
      <p className="text-white-600 mb-8 nunito-sans-body">
        These guidelines outline the rules and process for bulk registration for YESS’25. By participating in bulk registration, the POC and college agree to the following terms:
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">1. Eligibility</h2>
      <ul className="list-disc pl-6 text-white-600 mb-8 nunito-sans-body">
        <li>Bulk registration is available only for colleges with a minimum of 50 paid registrations.</li>
        <li>Only one official Point of Contact (POC) per college will be authorized for bulk registration.</li>
        <li>IEEE LINK reserves the right to verify and approve the POC before processing any registration.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Registration Process</h2>
      <ul className="list-disc pl-6 text-white-600 mb-8 nunito-sans-body">
        <li>The POC will be provided with an official Google Form template.</li>
        <li>The POC must make a copy of the form and use it to collect details of all participants from their college.</li>
        <li>The POC is responsible for ensuring all collected participant information is accurate and complete.</li>
        <li>Once the registration list is finalized, the POC must submit the completed details to the designated district coordinator.</li>
        <li>The deadline for submitting bulk registrations is 25th August 2025. No submissions will be accepted after this date.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Payment Process</h2>
      <ul className="list-disc pl-6 text-white-600 mb-8 nunito-sans-body">
        <li>All participants will pay the ticket fee directly to the POC via any mutually agreed method.</li>
        <li>No extra charges (such as taxes or processing fees) will be added for bulk registration — only the ticket fee applies.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Rewards for Bulk Registration</h2>
      <ul className="list-disc pl-6 text-white-600 mb-8 nunito-sans-body">
        <li>For the first 50 paid registrations, the college will receive 2 free tickets.</li>
        <li>For every additional 25 paid registrations, the college will receive 1 additional free ticket.</li>
        <li>No adjustments will be made — e.g., if there are 74 paid registrations, only 2 free tickets will be given (not 3).</li>
        <li>The details of complimentary ticket holders must be included along with the bulk registration list submitted by the POC.</li>
        <li>Free tickets are IEEE members exclusive, non-transferable outside the same college group, and cannot be exchanged for cash.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Responsibilities of the POC</h2>
      <ul className="list-disc pl-6 text-white-600 mb-8 nunito-sans-body">
        <li>Ensure timely collection of participant details and payments.</li>
        <li>Maintain accurate records of all registered participants and complimentary ticket holders.</li>
        <li>Transfer payments promptly to the district coordinator.</li>
        <li>Act as the single communication point between the college and the YESS’25 organizing team.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. General Terms</h2>
      <ul className="list-disc pl-6 text-white-600 mb-8 nunito-sans-body">
        <li>IEEE LINK reserves the right to reject any bulk registration request that does not comply with these guidelines.</li>
        <li>Any disputes regarding bulk registration will be resolved at the discretion of the YESS’25 organizing team, and their decision will be final.</li>
        <li>By proceeding with bulk registration, the POC confirms that they have the consent of all participants to share their details for event purposes.</li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="w-full relative z-10 bg-black/20">
        <Header2 isScrolled={isScrolled} />
        <div className="md:mt-20 mt-15 min-h-screen bg-black/20 backdrop-blur-xs [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-500/70">
          <GuidelinesContent />
        </div>
      </div>
    </div>
  );
}

export default BulkRegistrationGuidelines;
