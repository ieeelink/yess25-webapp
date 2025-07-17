import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import planeLottie from './iCVMii0Ol1.json';
import { MdClose } from 'react-icons/md';
import CheckStatus from '../pages/CheckStatus';
import Status from '../pages/Status';

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

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

async function displayRazorpay(amount, id, paymentProcessingRef, onPaymentComplete) {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  if (!res) {
    alert('Razorpay failed to load!!');
    paymentProcessingRef.current = false;
    return;
  }
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amount,
    currency: 'INR',
    name: "IEEE LINK",
    description: "YESS'25 Ticket Purchase",
    image: 'https://example.com/yess_logo.png',
    order_id: id,
    theme: {
      color: '#cc391c',
    },
    handler: function (response) {
      // Payment successful, keep loading state active until callback completes
      fetch('https://yess25-backend.railway.internal/api/payment/success-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (onPaymentComplete) onPaymentComplete();
        })
        .catch((error) => {
          alert('Payment verification failed. Please contact support.');
        });
    },
    modal: {
      ondismiss: function () {
        paymentProcessingRef.current = false;
        if (window.updatePaymentProcessingState) {
          window.updatePaymentProcessingState(false);
        }
      },
    },
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

const TicketForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    clearErrors,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentProcessingRef] = useState({ current: false });
  const isIEEEMember = watch('isIEEEMember');
  const [colleges, setColleges] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef(null);
  const [isOtherInstitution, setIsOtherInstitution] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [planeAnimKey, setPlaneAnimKey] = useState(0);
  const [showPlane, setShowPlane] = useState(false);
  const navigate = useNavigate();
  const [formCols, setFormCols] = useState('md:grid-cols-2');
  const [showCheckStatus, setShowCheckStatus] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  // Use a stable callback for closing the modal
  const handleCloseCheckStatus = useCallback(() => {
    setShowCheckStatus(false);
  }, []);

  // Move CheckStatusModal INSIDE TicketForm so it can access setShowCheckStatus
  function CheckStatusModal() {
    const modalContent = (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm min-h-screen overflow-y-auto py-8 pointer-events-auto">
        <div className="relative w-full max-w-2xl mx-auto pointer-events-auto">
          <CheckStatus onClose={handleCloseCheckStatus} />
        </div>
      </div>
    );
    if (typeof document !== 'undefined' && document.body) {
      return ReactDOM.createPortal(modalContent, document.body);
    }
    return modalContent;
  }

  useEffect(() => {
    function updateFormCols() {
      if (window.innerWidth >= 768 && window.innerHeight < 825) {
        setFormCols('md:grid-cols-3');
      } else {
        setFormCols('md:grid-cols-2');
      }
    }
    updateFormCols();
    window.addEventListener('resize', updateFormCols);
    return () => window.removeEventListener('resize', updateFormCols);
  }, []);

  // Show plane icon only on hover or loading
  const handleMouseEnter = (e) => {
    e.currentTarget.classList.add('animated-gradient-hover');
    setShowPlane(true);
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.classList.remove('animated-gradient-hover');
    if (!(isSubmitting || isLoading || isPaymentProcessing)) setShowPlane(false);
  };

  useEffect(() => {
    axios.get('https://yess25-backend.railway.internal/api/colleges')
      .then(res => {
        setColleges(res.data.colleges || []);
      })
      .catch(() => {
        setColleges([]);
      });
  }, []);

  useEffect(() => {
    const handleAutofill = () => {
      setTimeout(() => {
        const formData = getValues();
        let hasChanges = false;
        const fieldsToCheck = ['fullName', 'email', 'phone', 'institution', 'course'];
        fieldsToCheck.forEach(fieldName => {
          const element = document.getElementById(fieldName);
          if (element && element.value && element.value !== formData[fieldName]) {
            setValue(fieldName, element.value, { shouldValidate: true });
            hasChanges = true;
          }
        });
        const selectFields = ['gender', 'foodPreference', 'yearOfStudy'];
        selectFields.forEach(fieldName => {
          const element = document.getElementById(fieldName);
          if (element && element.value && element.value !== formData[fieldName]) {
            setValue(fieldName, element.value, { shouldValidate: true });
            hasChanges = true;
          }
        });
        const ieeeRadios = document.querySelectorAll('input[name="isIEEEMember"]');
        ieeeRadios.forEach(radio => {
          if (radio.checked && radio.value !== formData.isIEEEMember) {
            handleIEEEMemberChange(radio.value);
            hasChanges = true;
          }
        });
        if (hasChanges) {
          trigger();
        }
      }, 100);
    };
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('animationstart', (e) => {
        if (e.animationName.includes('autofill')) {
          handleAutofill();
        }
      });
      const inputs = form.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', handleAutofill);
        input.addEventListener('change', handleAutofill);
      });
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          setTimeout(handleAutofill, 50);
        });
      });
    }
    return () => {
      if (form) {
        form.removeEventListener('animationstart', handleAutofill);
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.removeEventListener('input', handleAutofill);
          input.removeEventListener('change', handleAutofill);
          input.removeEventListener('focus', handleAutofill);
        });
      }
    };
  }, [setValue, trigger, getValues]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
        setShowCollegeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      delete window.updatePaymentProcessingState;
    };
  }, []);

  useEffect(() => {
    if (isSubmitting || isLoading || isPaymentProcessing) {
      setShowSpinner(false);
      setPlaneAnimKey(prev => prev + 1); // force remount for animation
      setShowPlane(true); // keep plane visible during loading
    }
  }, [isSubmitting, isLoading, isPaymentProcessing]);

  // When loading, show spinner after plane animation
  useEffect(() => {
    if (isSubmitting || isLoading || isPaymentProcessing) {
      const timer = setTimeout(() => setShowSpinner(true), 1200); // match animation duration
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [isSubmitting, isLoading, isPaymentProcessing]);

  const onSubmit = async (data) => {
    setError('');
    const isValid = await trigger();
    if (!isValid) {
      setError('Please fill in all required fields correctly.');
      return;
    }
    setIsLoading(true);
    let institutionValue = data.institution;
    if (data.institutionIsOther) {
      institutionValue = data.institutionOther;
    }
    const { institutionIsOther, institutionOther, ...cleanData } = data;
    const formDataWithVerification = {
      ...cleanData,
      institution: institutionValue,
      ieeeVerificationCompleted: data.isIEEEMember === 'no',
      ieeeVerified: false
    };
    try {
      const response = await axios.post('https://yess25-backend.railway.internal/api/payment', formDataWithVerification);
      const serverresponse = response.data;
      setIsPaymentProcessing(true);
      paymentProcessingRef.current = true;
      document.cookie = `email=${serverresponse.notes.email}; path=/; max-age=${14*24*60*60}`;
      window.updatePaymentProcessingState = setIsPaymentProcessing;
      displayRazorpay(serverresponse.amount, serverresponse.id, paymentProcessingRef, () => setShowStatus(true));
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(error.response.message || 'This email is already registered');
      } else {
        setError('Error processing your registration. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  // SVG paths for morphing demo
  const PLANE_PATH = "M2,18 L18,2 L13,13 L22,8 L2,18 Z"; // stylized paper plane pointing top-right
  const SPINNER_PATH = "M12,2 A10,10 0 1,1 11.99,2 Z"; // circle for spinner

  if (showStatus) {
    return <Status />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* CheckStatus Modal */}
      {showCheckStatus && <CheckStatusModal />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-left">Registration Form</h1>
          <button
            type="button"
            aria-label="Close form"
            onClick={() => {
              if (onClose) return onClose();
              navigate('/');
            }}
            className="text-white hover:text-[#fe4a56] focus:outline-none p-2 rounded-full transition-colors"
          >
            <MdClose className="w-7 h-7" />
          </button>
        </div>
        <div className={`grid grid-cols-1 ${formCols} gap-6`}>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-white mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              {...register('fullName')}
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${
                errors.fullName ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.fullName.message}</p>
            )}
          </div>
          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-white mb-1">
              Gender *
            </label>
            <select
              id="gender"
              {...register('gender')}
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${
                errors.gender ? 'border-red-500' : 'border-white/20'
              }`}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.gender.message}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${
                errors.email ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.email.message}</p>
            )}
          </div>
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${
                errors.phone ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.phone.message}</p>
            )}
          </div>
          {/* Institution (Searchable Dropdown) */}
          <div ref={collegeDropdownRef} className="relative">
            <label htmlFor="institution" className="block text-sm font-medium text-white mb-1">
              College/Institution *
            </label>
            <input
              type="text"
              id="institution"
              autoComplete="off"
              {...register('institution')}
              value={isOtherInstitution ? 'Other' : (collegeSearch !== '' ? collegeSearch : (watch('institution') || ''))}
              onChange={e => {
                setCollegeSearch(e.target.value);
                setValue('institution', e.target.value, { shouldValidate: true });
                setIsOtherInstitution(false);
                setValue('institutionIsOther', false);
                setShowCollegeDropdown(true);
              }}
              onFocus={() => setShowCollegeDropdown(true)}
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${
                errors.institution ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Search or enter your college name"
              readOnly={isOtherInstitution}
            />
            {showCollegeDropdown && (
              <ul className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-white/20 rounded-md max-h-48 overflow-y-auto shadow-lg custom-scrollbar">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white font-semibold nunito-sans-body"
                  onClick={() => {
                    setIsOtherInstitution(true);
                    setValue('institution', 'Other', { shouldValidate: true });
                    setValue('institutionIsOther', true);
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
                    className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white nunito-sans-body"
                    onClick={() => {
                      setValue('institution', college, { shouldValidate: true });
                      setCollegeSearch(college);
                      setIsOtherInstitution(false);
                      setValue('institutionIsOther', false);
                      setShowCollegeDropdown(false);
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
            {errors.institution && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.institution.message}</p>
            )}
          </div>
          {/* If Other is selected, show extra input */}
          {isOtherInstitution && (
            <div className="mt-2">
              <label htmlFor="institutionOther" className="block text-sm font-medium text-white mb-1">
                Please specify your institution *
              </label>
              <input
                type="text"
                id="institutionOther"
                {...register('institutionOther')}
                className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${
                  errors.institutionOther ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your institution name"
              />
              {errors.institutionOther && (
                <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.institutionOther.message}</p>
              )}
            </div>
          )}
          {/* Course */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-white mb-1">
              Course/Stream *
            </label>
            <input
              type="text"
              id="course"
              {...register('course')}
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${
                errors.course ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="e.g., Computer Science"
            />
            {errors.course && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.course.message}</p>
            )}
          </div>
          {/* Food Preference */}
          <div>
            <label htmlFor="foodPreference" className="block text-sm font-medium text-white mb-1">
              Food Preference *
            </label>
            <select
              id="foodPreference"
              {...register('foodPreference')}
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${
                errors.foodPreference ? 'border-red-500' : 'border-white/20'
              }`}
            >
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
            {errors.foodPreference && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.foodPreference.message}</p>
            )}
          </div>
          {/* Year of Study */}
          <div>
            <label htmlFor="yearOfStudy" className="block text-sm font-medium text-white mb-1">
              Year of Study *
            </label>
            <select
              id="yearOfStudy"
              {...register('yearOfStudy')}
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${
                errors.yearOfStudy ? 'border-red-500' : 'border-white/20'
              }`}
            >
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
            {errors.yearOfStudy && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.yearOfStudy.message}</p>
            )}
          </div>
          {/* IEEE Membership */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Are you an IEEE Member? *
            </label>
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
            {errors.isIEEEMember && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.isIEEEMember.message}</p>
            )}
          </div>
          {/* IEEE Membership Number */}
          <div>
            <label htmlFor="ieeeMembershipNumber" className="block text-sm font-medium text-white mb-1">
              IEEE Membership Number {(isIEEEMember === 'yes' || isIEEEMember === 'gsm') && '*'}
            </label>
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
              className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed nunito-sans-body ${
                errors.ieeeMembershipNumber ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder={(isIEEEMember === 'yes' || isIEEEMember === 'gsm') ? "Enter your IEEE membership number" : "Not applicable"}
              maxLength="10"
            />
            {errors.ieeeMembershipNumber && (
              <p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.ieeeMembershipNumber.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => setShowCheckStatus(true)}
            className="text-gray-400 hover:text-white transition-colors text-sm underline order-2 md:order-1"
          >
            Check registration or retry failed payment
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading || isPaymentProcessing}
            className={`group w-full md:w-auto px-8 py-3 text-white rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold flex items-center justify-center gap-2 order-1 md:order-2 animated-gradient min-w-[120px] hover:min-w-[190px] ${(isSubmitting || isLoading || isPaymentProcessing) ? 'opacity-75 cursor-not-allowed' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ width: (isSubmitting || isLoading || isPaymentProcessing) ? undefined : undefined }}
          >
            <span className="flex items-center justify-center relative">
              Register Now
              {/* Lottie icon as flex child for dynamic sizing */}
              <span className="inline-block">
                <AnimatePresence initial={false} mode="wait">
                  {(showPlane || isSubmitting || isLoading || isPaymentProcessing) && (
                    <motion.span
                      key={`lottie-plane-${planeAnimKey}`}
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: 24, marginLeft: 8 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'inline-block', verticalAlign: 'middle' }}
                    >
                      <Lottie
                        animationData={planeLottie}
                        loop={isSubmitting || isLoading || isPaymentProcessing}
                        autoplay={isSubmitting || isLoading || isPaymentProcessing}
                        style={{ width: 36, height: 36 }}
                        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        isClickToPauseDisabled={true}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </span>
          </button>
        </div>
        {error && (
          <div className="mt-4 text-center md:text-left">
            <p className="text-red-500 text-sm nunito-sans-body">{error}</p>
          </div>
        )}
        {isPaymentProcessing && (
          <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-md">
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-blue-400 text-sm nunito-sans-body">
                Payment processing... Please wait while we confirm your payment.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TicketForm; 