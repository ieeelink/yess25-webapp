import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';

function Privacy() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const PrivacyContent = () => (
    <div className="prose prose-lg max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">PRIVACY POLICY</h1>
      <p className="text-white-600 mb-8 nunito-sans-body"><strong>Last updated</strong> June 12, 2025</p>

      <p className="text-white-600 mb-4 nunito-sans-body">
        This Privacy Notice for IEEE LINK ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
      </p>

      <ul className="list-disc pl-6 text-white-600 mb-4 nunito-sans-body">
        <li>Visit our website at yess.ieee-link.org or any website of ours that links to this Privacy Notice</li>
        <li>Use YESS'25 Tickets. A platform to provide tickets for attendees of YESS'25</li>
        <li>Engage with us in other related ways, including any sales, marketing, or events</li>
      </ul>

      <p className="text-white-600 mb-4 nunito-sans-body">
        <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at yess@ieee-link.org.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">SUMMARY OF KEY POINTS</h2>
      <p className="text-white-600 mb-4 nunito-sans-body">
        <em>This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.</em>
      </p>

      <div className="space-y-4 nunito-sans-body">
        <p className="text-white-600">
          <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
        </p>

        <p className="text-white-600">
          <strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.
        </p>

        <p className="text-white-600">
          <strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.
        </p>

        <p className="text-white-600">
          <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.
        </p>

        <p className="text-white-600">
          <strong>How do we keep your information safe?</strong> We have organizational and technical processes and procedures in place to protect your personal information.
        </p>

        <p className="text-white-600">
          <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">TABLE OF CONTENTS</h2>
      <ol className="list-decimal pl-6 text-white-600 mb-8 nunito-sans-body">
        <li><a href="#infocollect" className="text-white-600 hover:underline">WHAT INFORMATION DO WE COLLECT?</a></li>
        <li><a href="#infouse" className="text-white-600 hover:underline">HOW DO WE PROCESS YOUR INFORMATION?</a></li>
        <li><a href="#whoshare" className="text-white-600 hover:underline">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
        <li><a href="#cookies" className="text-white-600 hover:underline">DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></li>
        <li><a href="#inforetain" className="text-white-600 hover:underline">HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
        <li><a href="#infosafe" className="text-white-600 hover:underline">HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
        <li><a href="#infominors" className="text-white-600 hover:underline">DO WE COLLECT INFORMATION FROM MINORS?</a></li>
        <li><a href="#privacyrights" className="text-white-600 hover:underline">WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
        <li><a href="#DNT" className="text-white-600 hover:underline">CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
        <li><a href="#policyupdates" className="text-white-600 hover:underline">DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
        <li><a href="#contact" className="text-white-600 hover:underline">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
        <li><a href="#request" className="text-white-600 hover:underline">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
      </ol>

      <section id="infocollect">
        <h2 className="text-2xl font-bold mt-8 mb-4">1. WHAT INFORMATION DO WE COLLECT?</h2>
        <h3 className="text-xl font-bold mt-6 mb-3">Personal information you disclose to us</h3>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: We collect personal information that you provide to us.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include:
        </p>
        <ul className="list-disc pl-6 text-white-600 mb-4 nunito-sans-body">
          <li>Names</li>
          <li>Phone numbers</li>
          <li>Email addresses</li>
          <li>Billing addresses</li>
          <li>Debit/credit card numbers</li>
          <li>UPI ID</li>
          <li>Meal preferences</li>
          <li>Gender</li>
          <li>Education details (college, year of study)</li>
        </ul>
      </section>

      <section id="infouse">
        <h2 className="text-2xl font-bold mt-8 mb-4">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
        </p>
        <ul className="list-disc pl-6 text-white-600 mb-4 nunito-sans-body">
          <li>To deliver and facilitate delivery of services to the user</li>
          <li>To respond to user inquiries/offer support to users</li>
          <li>To send administrative information to you</li>
          <li>To fulfill and manage your orders</li>
          <li>To send you marketing and promotional communications</li>
          <li>To protect our Services</li>
        </ul>
      </section>

      <section id="whoshare">
        <h2 className="text-2xl font-bold mt-8 mb-4">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: We may share information in specific situations described in this section and/or with specific third parties.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We may need to share your personal information in the following situations:
        </p>
        <ul className="list-disc pl-6 text-white-600 mb-4 nunito-sans-body">
          <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
          <li><strong>Affiliates.</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Notice.</li>
        </ul>
      </section>

      <section id="cookies">
        <h2 className="text-2xl font-bold mt-8 mb-4">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: We may use cookies and other tracking technologies to collect and store your information.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
        </p>
      </section>

      <section id="inforetain">
        <h2 className="text-2xl font-bold mt-8 mb-4">5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law.
        </p>
      </section>

      <section id="infosafe">
        <h2 className="text-2xl font-bold mt-8 mb-4">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: We aim to protect your personal information through a system of organizational and technical security measures.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process.
        </p>
      </section>

      <section id="infominors">
        <h2 className="text-2xl font-bold mt-8 mb-4">7. DO WE COLLECT INFORMATION FROM MINORS?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: We do not knowingly collect data from or market to children under 18 years of age.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We do not knowingly collect, solicit data from, or market to children under 18 years of age.
        </p>
      </section>

      <section id="privacyrights">
        <h2 className="text-2xl font-bold mt-8 mb-4">8. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: You may review, change, or terminate your account at any time.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          If you have questions or comments about your privacy rights, you may email us at yess@ieee-link.org.
        </p>
      </section>

      <section id="DNT">
        <h2 className="text-2xl font-bold mt-8 mb-4">9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.
        </p>
      </section>

      <section id="policyupdates">
        <h2 className="text-2xl font-bold mt-8 mb-4">10. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          <em>In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-bold mt-8 mb-4">11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          If you have questions or comments about this notice, you may email us at yess@ieee-link.org or contact us by post at:
        </p>
        <p className="text-white-600 mb-4 nunito-sans-body">
          IEEE LINK<br />
          Pulimoodu<br />
          Thiruvananthapuram<br />
          Thiruvananthapuram, Kerala 695011<br />
          India
        </p>
      </section>

      <section id="request">
        <h2 className="text-2xl font-bold mt-8 mb-4">12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
        <p className="text-white-600 mb-4 nunito-sans-body">
          Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information.
        </p>
      </section>
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="h-full flex flex-col relative z-10 bg-white/10">
        <Header onNavigate={scrollToSection} />
        <div className="flex-1 overflow-y-auto md:mt-20 mt-15 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-500/70">
          <PrivacyContent />
        </div>
        <SubFooter onNavigate={scrollToSection} />
      </div>
    </div>
  );
}

export default Privacy; 