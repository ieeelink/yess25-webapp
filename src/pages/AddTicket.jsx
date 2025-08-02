import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import * as yup from 'yup';

// Validation schema
const validationSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .max(10, 'Phone number must be exactly 10 digits'),
  institution: yup
    .string()
    .when('institutionIsOther', {
      is: true,
      then: (schema) => schema.required('Please specify your institution'),
      otherwise: (schema) => schema.required('College/Institution name is required')
    })
    .min(3, 'Institution name must be at least 3 characters')
    .max(100, 'Institution name must not exceed 100 characters'),
  course: yup
    .string()
    .required('Course/Stream is required')
    .min(2, 'Course name must be at least 2 characters')
    .max(50, 'Course name must not exceed 50 characters'),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
  foodPreference: yup
    .string()
    .required('Food preference is required')
    .oneOf(['veg', 'non-veg'], 'Please select a valid food preference'),
  yearOfStudy: yup
    .string()
    .required('Year of study is required')
    .oneOf(['1', '2', '3', '4', 'graduate_student'], 'Please select a valid year of study'),
  isIEEEMember: yup
    .string()
    .required('IEEE membership status is required')
    .oneOf(['yes', 'no', 'gsm'], 'Please select IEEE membership status'),
  ieeeMembershipNumber: yup
    .string()
    .when('isIEEEMember', {
      is: (value) => value === 'yes' || value === 'gsm',
      then: (schema) => schema
        .required('IEEE membership number is required for IEEE members')
        .matches(/^\d{8,10}$/, 'Please enter a valid IEEE membership number (8-10 digits)')
        .max(10, 'IEEE membership number must not exceed 10 digits'),
      otherwise: (schema) => schema.optional(),
    }),
  institutionIsOther: yup.boolean(),
  institutionOther: yup.string().when('institutionIsOther', {
    is: true,
    then: (schema) => schema.required('Please specify your institution').min(3, 'Institution name must be at least 3 characters').max(100, 'Institution name must not exceed 100 characters'),
    otherwise: (schema) => schema.optional(),
  }),
});

function AddTicket() {
  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    email: '',
    phone: '',
    institution: '',
    institutionOther: '',
    course: '',
    foodPreference: '',
    yearOfStudy: '',
    isIEEEMember: '',
    ieeeMembershipNumber: '',
    institutionIsOther: false
  });
  
  const [isOtherInstitution, setIsOtherInstitution] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const navigate = useNavigate();

  // Fetch colleges on component mount
  useEffect(() => {
    axios.get(API_ENDPOINTS.COLLEGES)
      .then(res => {
        setColleges(res.data.colleges || []);
      })
      .catch(() => {
        setColleges([]);
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
        setShowCollegeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateField = async (name, value) => {
    try {
      await validationSchema.validateAt(name, { ...formData, [name]: value });
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    } catch (err) {
      setValidationErrors(prev => ({ ...prev, [name]: err.message }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle phone number - only allow digits
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      validateField(name, numericValue);
      return;
    }

    // Handle IEEE membership number - only allow digits
    if (name === 'ieeeMembershipNumber') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      if (formData.isIEEEMember === 'yes' || formData.isIEEEMember === 'gsm') {
        validateField(name, numericValue);
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    validateField(name, value);
  };

  const handleIEEEMemberChange = (value) => {
    setFormData(prev => ({
      ...prev,
      isIEEEMember: value,
      ieeeMembershipNumber: ''
    }));
    setValidationErrors(prev => ({ ...prev, ieeeMembershipNumber: null }));
    validateField('isIEEEMember', value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setValidationErrors({});

    // Validate all fields
    try {
      let institutionValue = formData.institution;
      if (formData.institutionIsOther || isOtherInstitution) {
        institutionValue = formData.institutionOther;
      }

      const validationData = {
        ...formData,
        institution: institutionValue,
        institutionIsOther: isOtherInstitution
      };

      await validationSchema.validate(validationData, { abortEarly: false });
    } catch (err) {
      const errors = {};
      err.inner.forEach(error => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      setError('Please fix the validation errors below.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required.');
        setLoading(false);
        return;
      }

      // Prepare data for submission
      let institutionValue = formData.institution;
      if (isOtherInstitution) {
        institutionValue = formData.institutionOther;
      }

      const { institutionIsOther, institutionOther, ...cleanData } = formData;
      const submissionData = {
        ...cleanData,
        institution: institutionValue,
        ieeeVerificationCompleted: formData.isIEEEMember === 'no',
        ieeeVerified: false
      };

      const response = await axios.post(API_ENDPOINTS.ADMIN_ADD_TICKET, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Ticket added successfully!');
      // Reset form
      setFormData({
        fullName: '',
        gender: '',
        email: '',
        phone: '',
        institution: '',
        institutionOther: '',
        course: '',
        foodPreference: '',
        yearOfStudy: '',
        isIEEEMember: '',
        ieeeMembershipNumber: '',
        institutionIsOther: false
      });
      setIsOtherInstitution(false);
      setCollegeSearch('');
      setValidationErrors({});
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(err.response.data.message || 'This email is already registered');
      } else {
        setError(err.response?.data?.message || 'Failed to add ticket. Please try again.');
      }
      console.error('Error adding ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#18181b]">
      {/* Header */}
      <header className="w-full flex items-center justify-start px-6 py-4 bg-[#1a1a1a] border-b border-gray-800 shadow z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/ticket-details')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <img src="/yess_icon.png" alt="YESS Logo" className="h-10 w-10" />
            <span className="text-white text-xl font-bold tracking-wide">Add New Ticket</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Form */}
          <div className="bg-[#232326] rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Ticket</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-400">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                      validationErrors.fullName ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                      validationErrors.gender ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    maxLength="10"
                    className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter 10-digit mobile number"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Institution Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div ref={collegeDropdownRef} className="relative">
                  <label className="block text-gray-300 mb-2 font-medium">College/Institution *</label>
                  <input
                    type="text"
                    name="institution"
                    autoComplete="off"
                    value={isOtherInstitution ? 'Other' : (collegeSearch !== '' ? collegeSearch : (formData.institution || ''))}
                    onChange={(e) => {
                      setCollegeSearch(e.target.value);
                      setFormData(prev => ({ ...prev, institution: e.target.value }));
                      setIsOtherInstitution(false);
                      setFormData(prev => ({ ...prev, institutionIsOther: false }));
                      setShowCollegeDropdown(true);
                      validateField('institution', e.target.value);
                    }}
                    onFocus={() => setShowCollegeDropdown(true)}
                    required
                    className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                      validationErrors.institution ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Search or enter your college name"
                    readOnly={isOtherInstitution}
                  />
                  {showCollegeDropdown && (
                    <ul className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-gray-700 rounded-md max-h-48 overflow-y-auto shadow-lg">
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white font-semibold"
                        onClick={() => {
                          setIsOtherInstitution(true);
                          setFormData(prev => ({ ...prev, institution: 'Other', institutionIsOther: true }));
                          setShowCollegeDropdown(false);
                        }}
                      >
                        Other
                      </li>
                      {colleges.filter(college =>
                        college.toLowerCase().includes((collegeSearch || '').toLowerCase())
                      ).map((college) => (
                        <li
                          key={college}
                          className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, institution: college, institutionIsOther: false }));
                            setCollegeSearch(college);
                            setIsOtherInstitution(false);
                            setShowCollegeDropdown(false);
                            validateField('institution', college);
                          }}
                        >
                          {college}
                        </li>
                      ))}
                      {colleges.filter(college =>
                        college.toLowerCase().includes((collegeSearch || '').toLowerCase())
                      ).length === 0 && (
                        <li className="px-4 py-2 text-gray-400">No results found</li>
                      )}
                    </ul>
                  )}
                  {validationErrors.institution && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.institution}</p>
                  )}
                </div>
                
                {isOtherInstitution && (
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Please specify your institution *</label>
                    <input
                      type="text"
                      name="institutionOther"
                      value={formData.institutionOther}
                      onChange={handleInputChange}
                      required={isOtherInstitution}
                      className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                        validationErrors.institutionOther ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter your institution name"
                    />
                    {validationErrors.institutionOther && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.institutionOther}</p>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Course/Stream *</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                      validationErrors.course ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="e.g., Computer Science"
                  />
                  {validationErrors.course && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.course}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Food Preference *</label>
                  <select
                    name="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleInputChange}
                    required
                    className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                      validationErrors.foodPreference ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select Food Preference</option>
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                  {validationErrors.foodPreference && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.foodPreference}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Year of Study *</label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleInputChange}
                    required
                    className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] ${
                      validationErrors.yearOfStudy ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select Year of Study</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                  {validationErrors.yearOfStudy && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.yearOfStudy}</p>
                  )}
                </div>
              </div>

              {/* IEEE Membership */}
              <div>
                <label className="block text-gray-300 mb-3 font-medium">Are you an IEEE Member? *</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIEEEMember"
                        value="yes"
                        checked={formData.isIEEEMember === 'yes'}
                        onChange={(e) => handleIEEEMemberChange(e.target.value)}
                        className="w-4 h-4 text-[#fe4a56] bg-gray-700 border-gray-600 focus:ring-[#fe4a56] focus:ring-2"
                        required
                      />
                      <span className="ml-2 text-gray-300">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIEEEMember"
                        value="no"
                        checked={formData.isIEEEMember === 'no'}
                        onChange={(e) => handleIEEEMemberChange(e.target.value)}
                        className="w-4 h-4 text-[#fe4a56] bg-gray-700 border-gray-600 focus:ring-[#fe4a56] focus:ring-2"
                        required
                      />
                      <span className="ml-2 text-gray-300">No</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIEEEMember"
                        value="gsm"
                        checked={formData.isIEEEMember === 'gsm'}
                        onChange={(e) => handleIEEEMemberChange(e.target.value)}
                        className="w-4 h-4 text-[#fe4a56] bg-gray-700 border-gray-600 focus:ring-[#fe4a56] focus:ring-2"
                        required
                      />
                      <span className="ml-2 text-gray-300">Graduate Student Member</span>
                    </label>
                  </div>
                </div>
                {validationErrors.isIEEEMember && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.isIEEEMember}</p>
                )}
              </div>

              {/* IEEE Membership Number */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  IEEE Membership Number {(formData.isIEEEMember === 'yes' || formData.isIEEEMember === 'gsm') && '*'}
                </label>
                <input
                  type="text"
                  name="ieeeMembershipNumber"
                  value={formData.ieeeMembershipNumber}
                  onChange={handleInputChange}
                  disabled={formData.isIEEEMember !== 'yes' && formData.isIEEEMember !== 'gsm'}
                  required={formData.isIEEEMember === 'yes' || formData.isIEEEMember === 'gsm'}
                  maxLength="10"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full bg-[#18181b] text-gray-200 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.ieeeMembershipNumber ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder={
                    (formData.isIEEEMember === 'yes' || formData.isIEEEMember === 'gsm') 
                      ? "Enter your IEEE membership number" 
                      : "Not applicable"
                  }
                />
                {validationErrors.ieeeMembershipNumber && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.ieeeMembershipNumber}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#fe4a56] text-white rounded-lg font-semibold hover:bg-[#8c0505] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Ticket...' : 'Add Ticket'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/admin/ticket-details')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTicket;
