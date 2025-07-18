import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
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

function UpdateTicketForm({ ticket, onClose, onSave }) {
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
    defaultValues: {
      ...ticket,
      institutionIsOther: ticket?.institutionIsOther || false,
      institutionOther: ticket?.institutionIsOther ? ticket.institution : '',
      institution: ticket?.institutionIsOther ? 'Other' : ticket?.institution || '',
    },
  });

  const [colleges, setColleges] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef(null);
  const isOtherInstitution = watch('institutionIsOther');
  const isIEEEMember = watch('isIEEEMember');

  // Fetch colleges (copied from TicketForm)
  useEffect(() => {
    axios.get('https://yess25-backend.railway.internal/api/colleges')
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
  const onSubmit = (data) => {
    let institutionValue = data.institution;
    if (data.institutionIsOther) {
      institutionValue = data.institutionOther;
    }
    const { institutionIsOther, institutionOther, ...cleanData } = data;
    onSave({ ...cleanData, institution: institutionValue });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#232326] rounded-xl shadow-lg p-8 w-full max-w-4xl relative border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Edit Ticket</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div ref={collegeDropdownRef} className="relative">
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
              <div className="mt-2">
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
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-white mb-1">Course/Stream *</label>
              <input
                type="text"
                id="course"
                {...register('course')}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.course ? 'border-red-500' : 'border-white/20'}`}
                placeholder="e.g., Computer Science"
              />
              {errors.course && <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.course.message}</p>}
            </div>
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
            {/* IEEE Membership */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Are you an IEEE Member? *</label>
              <div className="flex items-center gap-6">
                <div className="flex gap-6">
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
                </div>
              </div>
              <div className="flex items-center mt-2">
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
            {/* IEEE Membership Number */}
            <div>
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
          </div>
          {/* Ticket & Payment Details Section */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-white mb-4">Ticket & Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              {/* amount_paid */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Amount Paid</label>
                <input type="text" value={ticket.amount_paid ? `₹${(ticket.amount_paid/100).toFixed(2)}` : ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* orderId */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Order ID</label>
                <input type="text" value={ticket.orderId || ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* paymentId */}
              <div>
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
              <div>
                <label className="block text-sm font-medium text-white mb-1">Receipt</label>
                <input type="text" value={ticket.receipt || ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* timestamp */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Created At</label>
                <input type="text" value={ticket.timestamp && ticket.timestamp.$date ? new Date(ticket.timestamp.$date).toLocaleString() : ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* paymentCompletedAt */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Payment Completed At</label>
                <input type="text" value={ticket.paymentCompletedAt && ticket.paymentCompletedAt.$date ? new Date(ticket.paymentCompletedAt.$date).toLocaleString() : ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
              {/* paymentVerifiedAt */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Payment Verified At</label>
                <input type="text" value={ticket.paymentVerifiedAt && ticket.paymentVerifiedAt.$date ? new Date(ticket.paymentVerifiedAt.$date).toLocaleString() : ''} disabled className="w-full px-3 py-2 bg-white/5 border rounded-md text-white border-white/20 placeholder-gray-400 nunito-sans-body opacity-60 cursor-not-allowed" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 font-semibold">Close</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-[#fe4a56] text-white hover:bg-[#8c0505] font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTicketForm; 