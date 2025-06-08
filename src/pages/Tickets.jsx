import React, { useState } from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Tickets() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    course: '',
    isIEEEMember: 'no',
    ieeeMembershipNumber: '',
    gender: 'male',
    foodPreference: 'veg',
    yearOfStudy: '1',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user types in any field
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error
    setIsLoading(true); // Start loading

    // axios.post('http://localhost:3000/api/payment', formData)
    axios.post('api/payment', formData)
      .then(response => {
        // Handle success response
        console.log('Registration successful:', response.data);
        document.cookie = `email=${response.data.response.email}; path=/; max-age=${14*24*60*60}`;
        window.location.href = response.data.response.redirectUrl;
      }).catch(error => {
        if (error.response && error.response.status === 409) {
          setError(error.response.data.message || 'This email is already registered');
        } else {
          setError('Error processing your registration. Please try again.');
        }
        console.error('Error checking email:', error);
        setIsLoading(false); // Stop loading on error
      });
  };

  return (
    <>
      <div className="fixed inset-0 z-0">
        <BgAnimation/>
      </div>
      <div className="relative min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center px-4 py-8 mt-20 md:mt-0">
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
                  <label htmlFor="gender" className="block text-sm font-medium text-white mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
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
                  <label htmlFor="course" className="block text-sm font-medium text-white mb-1">
                    Course/Stream
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="foodPreference" className="block text-sm font-medium text-white mb-1">
                    Food Preference
                  </label>
                  <select
                    id="foodPreference"
                    name="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a]"
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="yearOfStudy" className="block text-sm font-medium text-white mb-1">
                    Year of Study
                  </label>
                  <select
                    id="yearOfStudy"
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
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
                          checked={formData.isIEEEMember === 'no'}
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

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Link 
                  to="/checkStatus" 
                  className="text-gray-400 hover:text-white transition-colors text-sm underline order-2 md:order-1"
                >
                  Check registration or retry failed payment
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full md:w-auto px-8 py-3 bg-[#fe4a56] text-white rounded-md hover:bg-[#8c0505] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold flex items-center justify-center gap-2 order-1 md:order-2 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Register Now'
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 text-center md:text-left">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>
        </main>

        <SubFooter />
      </div>
    </>
  );
}

export default Tickets;
