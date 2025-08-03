import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema (copied from TicketForm)
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
    .when('courseIsOther', {
      is: true,
      then: (schema) => schema.required('Please specify your course'),
      otherwise: (schema) => schema.required('Course/Stream is required')
    })
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
    .oneOf(['1', '2', '3', '4'], 'Please select a valid year of study'),
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
  courseIsOther: yup.boolean(),
  courseOther: yup.string().when('courseIsOther', {
    is: true,
    then: (schema) => schema.required('Please specify your course').min(2, 'Course name must be at least 2 characters').max(50, 'Course name must not exceed 50 characters'),
    otherwise: (schema) => schema.optional(),
  }),
});

function UpdateTicketForm({ ticket, onClose, onSave }) {
  // Helper function to map display values to form values
  const mapTicketDataToFormValues = (ticket) => {
    if (!ticket) return {};
    
    // Map gender: "Male" -> "male", "Female" -> "female", "Other" -> "other"
    const genderMap = { "Male": "male", "Female": "female", "Other": "other" };
    
    // Map year of study: "First Year" -> "1", "Second Year" -> "2", etc.
    const yearMap = { 
      "First Year": "1", 
      "Second Year": "2", 
      "Third Year": "3", 
      "Fourth Year": "4",
      "Graduate Student": "graduate_student"
    };
    
    // Map food preference: "Veg" -> "veg", "Non-Veg" -> "non-veg"
    const foodMap = { "Veg": "veg", "Non-Veg": "non-veg" };
    
    return {
      fullName: ticket.fullName || '',
      email: ticket.email || '',
      phone: ticket.phone?.replace(/^\(\+91\)\s*/, '') || '', // Remove (+91) prefix if present
      gender: genderMap[ticket.gender] || ticket.gender?.toLowerCase() || '',
      yearOfStudy: yearMap[ticket.yearOfStudy] || ticket.yearOfStudy || '',
      institution: ticket.institution || '',
      course: ticket.course || '',
      foodPreference: foodMap[ticket.foodPreference] || ticket.foodPreference?.toLowerCase().replace('-', '-') || '',
      isIEEEMember: ticket.isIEEEMember || 'no',
      ieeeMembershipNumber: ticket.ieeeMembershipNumber || '',
      institutionIsOther: false, // Always start with false, let user select "Other" if needed
      institutionOther: '', // Start empty
      courseIsOther: false, // Always start with false, let user select "Other" if needed
      courseOther: '', // Start empty
    };
  };

  // Set up react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    trigger,
    clearErrors,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: mapTicketDataToFormValues(ticket),
  });

  const [colleges, setColleges] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef(null);
  const isOtherInstitution = watch('institutionIsOther');
  const isOtherCourse = watch('courseIsOther');
  const isIEEEMember = watch('isIEEEMember');

  // Fetch colleges (copied from TicketForm)
  useEffect(() => {
    axios.get(API_ENDPOINTS.COLLEGES)
      .then(res => {
        setColleges(res.data.colleges || []);
      })
      .catch(() => {
        setColleges([]);
      });
  }, []);

  // Dropdown close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
        setShowCollegeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle institution dropdown and "Other"
  const handleInstitutionChange = (value) => {
    setValue('institution', value, { shouldValidate: true });
    setValue('institutionIsOther', value === 'Other');
    if (value !== 'Other') {
      setValue('institutionOther', '');
    }
    setShowCollegeDropdown(false);
  };

  // Handle course selection and "Other"
  const handleCourseChange = (value) => {
    setValue('course', value, { shouldValidate: true });
    setValue('courseIsOther', value === 'Other');
    if (value !== 'Other') {
      setValue('courseOther', '');
    }
  };

  // Handle IEEE member radio
  const handleIEEEMemberChange = (value) => {
    setValue('isIEEEMember', value);
    setValue('ieeeMembershipNumber', '');
    if (errors.ieeeMembershipNumber) {
      clearErrors('ieeeMembershipNumber');
    }
    if (value === 'yes' || value === 'gsm') {
      trigger('ieeeMembershipNumber');
    }
  };

  // Save handler
  const onSubmit = async (data) => {
    try {
      // Map form values back to display format for consistency with server data
      const genderDisplayMap = { "male": "Male", "female": "Female", "other": "Other" };
      const yearDisplayMap = { 
        "1": "First Year", 
        "2": "Second Year", 
        "3": "Third Year", 
        "4": "Fourth Year"
      };
      const foodDisplayMap = { "veg": "Veg", "non-veg": "Non-Veg" };
      
      let institutionValue = data.institution;
      if (data.institutionIsOther) {
        institutionValue = data.institutionOther;
      }
      
      let courseValue = data.course;
      if (data.courseIsOther) {
        courseValue = data.courseOther;
      }
      
      const { institutionIsOther, institutionOther, courseIsOther, courseOther, ...cleanData } = data;
      
      // Prepare the update payload (only editable fields)
      const updatePayload = {
        fullName: cleanData.fullName,
        email: cleanData.email,
        phone: cleanData.phone.startsWith('(+91)') ? cleanData.phone : `(+91) ${cleanData.phone}`,
        institution: institutionValue,
        course: courseValue,
        gender: genderDisplayMap[cleanData.gender] || cleanData.gender,
        yearOfStudy: yearDisplayMap[cleanData.yearOfStudy] || cleanData.yearOfStudy,
        foodPreference: foodDisplayMap[cleanData.foodPreference] || cleanData.foodPreference,
        isIEEEMember: cleanData.isIEEEMember,
        ieeeMembershipNumber: cleanData.ieeeMembershipNumber,
      };

      // Make API call to update ticket
      const response = await axios.put(
        API_ENDPOINTS.ADMIN_UPDATE_TICKET(ticket._id),
        updatePayload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Map updated data back to complete ticket format for consistency
        const updatedTicket = {
          ...ticket, // Preserve all original ticket data
          ...updatePayload, // Override with updated form data
        };
        
        onSave(updatedTicket);
      } else {
        throw new Error(response.data.message || 'Failed to update ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert(error.response?.data?.message || error.message || 'Failed to update ticket. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-[#232326] rounded-xl shadow-lg p-8 w-full max-w-[95vw] relative border border-gray-800 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Edit Ticket</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-1">Full Name *</label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.fullName ? 'border-red-500' : 'border-white/20'}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.fullName.message}</p>}
            </div>
            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-white mb-1">Gender *</label>
              <select
                id="gender"
                {...register('gender')}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.gender ? 'border-red-500' : 'border-white/20'}`}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.gender.message}</p>}
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email Address *</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.email ? 'border-red-500' : 'border-white/20'}`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.email.message}</p>}
            </div>
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.phone ? 'border-red-500' : 'border-white/20'}`}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.phone.message}</p>}
            </div>
            {/* Institution (Dropdown) */}
            <div ref={collegeDropdownRef} className="relative md:col-span-2">
              <label htmlFor="institution" className="block text-sm font-medium text-white mb-1">College/Institution *</label>
              <input
                type="text"
                id="institution"
                autoComplete="off"
                {...register('institution')}
                value={isOtherInstitution ? 'Other' : (collegeSearch !== '' ? collegeSearch : (watch('institution') || ''))}
                onChange={e => {
                  setCollegeSearch(e.target.value);
                  setValue('institution', e.target.value, { shouldValidate: true });
                  setValue('institutionIsOther', false);
                  setShowCollegeDropdown(true);
                }}
                onFocus={() => setShowCollegeDropdown(true)}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.institution ? 'border-red-500' : 'border-white/20'}`}
                placeholder="Search or enter your college name"
                readOnly={isOtherInstitution}
              />
              {showCollegeDropdown && (
                <ul className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-white/20 rounded-md max-h-48 overflow-y-auto shadow-lg custom-scrollbar">
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white font-semibold nunito-sans-body"
                    onClick={() => handleInstitutionChange('Other')}
                  >
                    Other
                  </li>
                  {colleges.filter(college =>
                    college.toLowerCase().includes((collegeSearch || '').toLowerCase())
                  ).map((college) => (
                    <li
                      key={college}
                      className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white nunito-sans-body"
                      onClick={() => {
                        handleInstitutionChange(college);
                        setCollegeSearch(college);
                      }}
                    >
                      {college}
                    </li>
                  ))}
                  {colleges.filter(college =>
                    college.toLowerCase().includes((collegeSearch || '').toLowerCase())
                  ).length === 0 && (
                    <li className="px-4 py-2 text-gray-400 nunito-sans-body">No results found</li>
                  )}
                </ul>
              )}
              {errors.institution && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.institution.message}</p>}
            </div>
            {/* If Other is selected, show extra input */}
            {isOtherInstitution && (
              <div className="md:col-span-2">
                <label htmlFor="institutionOther" className="block text-sm font-medium text-white mb-1">Please specify your institution *</label>
                <input
                  type="text"
                  id="institutionOther"
                  {...register('institutionOther')}
                  className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.institutionOther ? 'border-red-500' : 'border-white/20'}`}
                  placeholder="Enter your institution name"
                />
                {errors.institutionOther && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.institutionOther.message}</p>}
              </div>
            )}
            {/* Course */}
            <div className="md:col-span-2">
              <label htmlFor="course" className="block text-sm font-medium text-white mb-1">Course/Stream *</label>
              <select
                id="course"
                {...register('course')}
                onChange={(e) => handleCourseChange(e.target.value)}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.course ? 'border-red-500' : 'border-white/20'}`}
              >
                <option value="">Select your course/stream</option>
                <option value="Computer Science and Allied courses">Computer Science and Allied courses</option>
                <option value="Electrical and Allied courses">Electrical and Allied courses</option>
                <option value="Electronics and Allied courses">Electronics and Allied courses</option>
                <option value="Mechanical and Allied courses">Mechanical and Allied courses</option>
                <option value="Chemical and Allied courses">Chemical and Allied courses</option>
                <option value="Civil and Allied courses">Civil and Allied courses</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Other">Other</option>
              </select>
              {errors.course && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.course.message}</p>}
            </div>
            {/* If Other course is selected, show extra input */}
            {isOtherCourse && (
              <div className="md:col-span-2">
                <label htmlFor="courseOther" className="block text-sm font-medium text-white mb-1">Please specify your course *</label>
                <input
                  type="text"
                  id="courseOther"
                  {...register('courseOther')}
                  className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.courseOther ? 'border-red-500' : 'border-white/20'}`}
                  placeholder="Enter your course name"
                />
                {errors.courseOther && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.courseOther.message}</p>}
              </div>
            )}
            {/* Food Preference */}
            <div>
              <label htmlFor="foodPreference" className="block text-sm font-medium text-white mb-1">Food Preference *</label>
              <select
                id="foodPreference"
                {...register('foodPreference')}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.foodPreference ? 'border-red-500' : 'border-white/20'}`}
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
              {errors.foodPreference && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.foodPreference.message}</p>}
            </div>
            {/* Year of Study */}
            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium text-white mb-1">Year of Study *</label>
              <select
                id="yearOfStudy"
                {...register('yearOfStudy')}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.yearOfStudy ? 'border-red-500' : 'border-white/20'}`}
              >
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
              {errors.yearOfStudy && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.yearOfStudy.message}</p>}
            </div>
            {/* IEEE Membership Number */}
            <div className="md:col-span-1">
              <label htmlFor="ieeeMembershipNumber" className="block text-sm font-medium text-white mb-1">IEEE Membership Number {(isIEEEMember === 'yes' || isIEEEMember === 'gsm') && '*'}</label>
              <input
                type="text"
                id="ieeeMembershipNumber"
                {...register('ieeeMembershipNumber')}
                disabled={isIEEEMember !== 'yes' && isIEEEMember !== 'gsm'}
                inputMode="numeric"
                pattern="[0-9]*"
                onInput={e => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                }}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed nunito-sans-body ${errors.ieeeMembershipNumber ? 'border-red-500' : 'border-white/20'}`}
                placeholder={(isIEEEMember === 'yes' || isIEEEMember === 'gsm') ? "Enter your IEEE membership number" : "Not applicable"}
                maxLength="10"
              />
              {errors.ieeeMembershipNumber && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.ieeeMembershipNumber.message}</p>}
            </div>
            {/* IEEE Membership */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-white mb-1">Are you an IEEE Member? *</label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isIEEEMember"
                    value="yes"
                    checked={isIEEEMember === 'yes'}
                    onChange={(e) => handleIEEEMemberChange(e.target.value)}
                    className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2"
                  />
                  <span className="ml-2 text-white nunito-sans-body">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isIEEEMember"
                    value="no"
                    checked={isIEEEMember === 'no'}
                    onChange={(e) => handleIEEEMemberChange(e.target.value)}
                    className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2"
                  />
                  <span className="ml-2 text-white nunito-sans-body">No</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isIEEEMember"
                    value="gsm"
                    checked={isIEEEMember === 'gsm'}
                    onChange={(e) => handleIEEEMemberChange(e.target.value)}
                    className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2"
                  />
                  <span className="ml-2 text-white nunito-sans-body">Graduate Student Member</span>
                </label>
              </div>
              {errors.isIEEEMember && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.isIEEEMember.message}</p>}
            </div>
            
          </div>
          {/* Ticket & Payment Details Section */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-white mb-4">Ticket & Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {/* yessTicketId */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Ticket ID</label>
                <input type="text" value={ticket.yessTicketId || ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* status */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Status</label>
                <input type="text" value={ticket.status || ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* amount */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Amount</label>
                <input type="text" value={ticket.amount ? `₹${(ticket.amount/100).toFixed(2)}` : ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* paymentId */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-white mb-1">Payment ID</label>
                <input type="text" value={ticket.paymentId || ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* paymentStatus */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Payment Status</label>
                <input type="text" value={ticket.paymentStatus || ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* paymentVerified */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Payment Verified</label>
                <input type="text" value={ticket.paymentVerified ? 'Yes' : 'No'} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* ieeeVerificationCompleted */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">IEEE Verification Completed</label>
                <input type="text" value={ticket.ieeeVerificationCompleted ? 'Yes' : 'No'} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* ieeeVerified */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">IEEE Verified</label>
                <input type="text" value={ticket.ieeeVerified ? 'Yes' : 'No'} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* receipt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">Receipt</label>
                <input type="text" value={ticket.registrationId || ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* timestamp */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">Created At</label>
                <input type="text" value={ticket.timestamp ? new Date(ticket.timestamp).toLocaleString() : ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* paymentCompletedAt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">Payment Completed At</label>
                <input type="text" value={ticket.paymentCompletedAt ? new Date(ticket.paymentCompletedAt).toLocaleString() : ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* paymentVerifiedAt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">Payment Verified At</label>
                <input type="text" value={ticket.paymentVerifiedAt ? new Date(ticket.paymentVerifiedAt).toLocaleString() : ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* source */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">Source</label>
                <input type="text" value={ticket.source || ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 font-semibold">Close</button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-4 py-2 rounded bg-[#fe4a56] text-white hover:bg-[#8c0505] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTicketForm; 