import React, { useState } from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';

function Tickets() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    studentId: '',
    ticketType: 'student',
    dietaryRestrictions: '',
    specialRequirements: '',
    isIEEEMember: 'no',
    ieeeMembershipNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Ticket registration submitted:', formData);
  };

  return (
    <>
    <BgAnimation/>
    <div className="min-h-screen flex flex-col relative">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">Register for IEEE YESS'25</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-white mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-white mb-1">
                  College
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-white mb-1">
                  Course/Stream
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="ticketType" className="block text-sm font-medium text-white mb-1">
                  Year of Study
                </label>
                <select
                  id="ticketType"
                  name="ticketType"
                  value={formData.ticketType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a]"
                >
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>

              <div>
                <label htmlFor="ieeeMembership" className="block text-sm font-medium text-white mb-1">
                  Are you an IEEE Member?
                </label>
                <div className="flex items-center gap-6">
                  <div className="flex gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIEEEMember"
                        value="yes"
                        onChange={handleChange}
                        className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2"
                      />
                      <span className="ml-2 text-white">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIEEEMember"
                        value="no"
                        onChange={handleChange}
                        className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2"
                      />
                      <span className="ml-2 text-white">No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="ieeeMembershipNumber" className="block text-sm font-medium text-white mb-1">IEEE Membership Number</label>
              <div className="flex-1">
                    <input
                      type="text"
                      id="ieeeMembershipNumber"
                      name="ieeeMembershipNumber"
                      value={formData.ieeeMembershipNumber}
                      onChange={handleChange}
                      required={formData.isIEEEMember === 'yes'}
                      disabled={formData.isIEEEMember === 'no'}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Membership Number"
                    />
                  </div>
              </div>

              {/* <div className="md:col-span-2">
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-white mb-1">
                  Dietary Restrictions (if any)
                </label>
                <textarea
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="specialRequirements" className="block text-sm font-medium text-white mb-1">
                  Special Requirements (if any)
                </label>
                <textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
                />
              </div> */}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-[#fe4a56] text-white rounded-md hover:bg-[#8c0505] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold"
              >
                Register Now
              </button>
            </div>
          </form>
        </div>
      </main>

      <SubFooter />
    </div>
    </>
  );
}

export default Tickets;
