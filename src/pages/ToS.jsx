import React, { useState, useEffect, useCallback } from 'react';
import BgAnimation from '../components/BgAnimation';
import Header2 from '../components/Header2';

function ToS() {
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

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ToSContent = () => (
    <div className="prose prose-lg max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">TERMS OF SERVICE</h1>
      <p className="text-white-600 mb-8 nunito-sans-body"><strong>Last updated</strong> June 12, 2025</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">AGREEMENT TO OUR LEGAL TERMS</h2>
      <p className="text-white-600 mb-4 nunito-sans-body">
        We are IEEE LINK ("Company," "we," "us," "our"), a company registered in India at Pulimoodu, Thiruvananthapuram, Thiruvananthapuram, Kerala 695011.
      </p>
      <p className="text-white-600 mb-4 nunito-sans-body">
        We operate the website yess.ieee-link.org (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
      </p>
      <p className="text-white-600 mb-4 nunito-sans-body">
        We provide a ticketing platform for YESS'25
      </p>
      <p className="text-white-600 mb-4 nunito-sans-body">
        You can contact us email at yess@ieee-link.org, or by mail to Pulimoodu, Thiruvananthapuram, Thiruvananthapuram, Kerala 695011, India.
      </p>
      <p className="text-white-600 mb-4 nunito-sans-body">
        These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and IEEE LINK, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">TABLE OF CONTENTS</h2>
      <ol className="list-decimal pl-6 text-white-600 mb-8 nunito-sans-body">
        <li><a href="#services" className="text-white-600 hover:underline">OUR SERVICES</a></li>
        <li><a href="#ip" className="text-white-600 hover:underline">INTELLECTUAL PROPERTY RIGHTS</a></li>
        <li><a href="#userreps" className="text-white-600 hover:underline">USER REPRESENTATIONS</a></li>
        <li><a href="#products" className="text-white-600 hover:underline">PRODUCTS</a></li>
        <li><a href="#purchases" className="text-white-600 hover:underline">PURCHASES AND PAYMENT</a></li>
        <li><a href="#returnno" className="text-white-600 hover:underline">RETURN POLICY</a></li>
        <li><a href="#prohibited" className="text-white-600 hover:underline">PROHIBITED ACTIVITIES</a></li>
        <li><a href="#ugc" className="text-white-600 hover:underline">USER GENERATED CONTRIBUTIONS</a></li>
        <li><a href="#license" className="text-white-600 hover:underline">CONTRIBUTION LICENSE</a></li>
        <li><a href="#thirdparty" className="text-white-600 hover:underline">THIRD-PARTY WEBSITES AND CONTENT</a></li>
        <li><a href="#sitemanage" className="text-white-600 hover:underline">SERVICES MANAGEMENT</a></li>
        <li><a href="#ppyes" className="text-white-600 hover:underline">PRIVACY POLICY</a></li>
        <li><a href="#terms" className="text-white-600 hover:underline">TERM AND TERMINATION</a></li>
      </ol>

      <section id="services">
        <h2 className="text-2xl font-bold mt-8 mb-4">1. OUR SERVICES</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
        </p>
      </section>

      <section id="ip">
        <h2 className="text-2xl font-bold mt-8 mb-4">2. INTELLECTUAL PROPERTY RIGHTS</h2>
        <h3 className="text-xl font-bold mt-6 mb-3">Our intellectual property</h3>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world.
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use only.
        </p>
      </section>

      <section id="userreps">
        <h2 className="text-2xl font-bold mt-8 mb-4">3. USER REPRESENTATIONS</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          By using the Services, you represent and warrant that:
        </p>
        <ol className="list-decimal pl-6 text-white-600 mb-4 nunito-sans-body">
          <li>You have the legal capacity and you agree to comply with these Legal Terms;</li>
          <li>You are not a minor in the jurisdiction in which you reside;</li>
          <li>You will not access the Services through automated or non-human means;</li>
          <li>You will not use the Services for any illegal or unauthorized purpose;</li>
          <li>Your use of the Services will not violate any applicable law or regulation.</li>
        </ol>
      </section>

      <section id="products">
        <h2 className="text-2xl font-bold mt-8 mb-4">4. PRODUCTS</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Services. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
        </p>
      </section>

      <section id="purchases">
        <h2 className="text-2xl font-bold mt-8 mb-4">5. PURCHASES AND PAYMENT</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">We accept the following forms of payment:</p>
        <ul className="list-disc pl-6 text-white-600 mb-4 nunito-sans-body">
          <li>Visa</li>
          <li>Mastercard</li>
          <li>American Express</li>
          <li>UPI</li>
        </ul>
        <p className="text-white-600 mb-4 nunito-sans-body">
          You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in Indian Rupee.
        </p>
      </section>

      <section id="returnno">
        <h2 className="text-2xl font-bold mt-8 mb-4">6. RETURN POLICY</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          All sales are final and no refund will be issued.
        </p>
      </section>

      <section id="prohibited">
        <h2 className="text-2xl font-bold mt-8 mb-4">7. PROHIBITED ACTIVITIES</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">As a user of the Services, you agree not to:</p>
        <ul className="list-disc pl-6 text-white-600 mb-4 nunito-sans-body">
          <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
          <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
          <li>Circumvent, disable, or otherwise interfere with security-related features of the Services.</li>
          <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
          <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
          <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
          <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
          <li>Engage in unauthorized framing of or linking to the Services.</li>
          <li>Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Services.</li>
          <li>Engage in any automated use of the system, such as using scripts to send comments or messages.</li>
          <li>Delete the copyright or other proprietary rights notice from any Content.</li>
          <li>Attempt to impersonate another user or person or use the username of another user.</li>
          <li>Use the Services to advertise or offer to sell goods and services.</li>
          <li>Sell or otherwise transfer your profile.</li>
        </ul>
      </section>

      <section id="ugc">
        <h2 className="text-2xl font-bold mt-8 mb-4">8. USER GENERATED CONTRIBUTIONS</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          The Services does not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions").
        </p>
      </section>

      <section id="license">
        <h2 className="text-2xl font-bold mt-8 mb-4">9. CONTRIBUTION LICENSE</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          You and Services agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices (including settings).
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.
        </p>
      </section>

      <section id="thirdparty">
        <h2 className="text-2xl font-bold mt-8 mb-4">10. THIRD-PARTY WEBSITES AND CONTENT</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          The Services may contain (or you may be sent via the Site) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content").
        </p>
      </section>

      <section id="sitemanage">
        <h2 className="text-2xl font-bold mt-8 mb-4">11. SERVICES MANAGEMENT</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable any of your Contributions; (4) remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.
        </p>
      </section>

      <section id="ppyes">
        <h2 className="text-2xl font-bold mt-8 mb-4">12. PRIVACY POLICY</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We care about data privacy and security. Please review our Privacy Policy: <a href="/privacy" className="text-white-600 hover:underline">yess.ieee-link.org/privacy</a>. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.
        </p>
      </section>

      <section id="terms">
        <h2 className="text-2xl font-bold mt-8 mb-4">13. TERM AND TERMINATION</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
        </p>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="w-full relative z-10">
        <Header2 isScrolled={isScrolled} onNavigate={scrollToSection} />
        <div className="md:mt-20 mt-15 min-h-screen bg-black/20 backdrop-blur-xs [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-500/70">
          <ToSContent />
        </div>
      </div>
    </div>
  );
}

export default ToS;
