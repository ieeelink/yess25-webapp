import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

async function displayRazorpay(amount, id, paymentProcessingRef) {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

  if (!res) {
    alert('Razorpay failed to load!!')
    paymentProcessingRef.current = false;
    return 
  }

  const options = {
    "key": import.meta.env.VITE_RAZORPAY_TEST_KEY_ID,
    "amount": amount,
    "currency": "INR",
    "name": "IEEE LINK",
    "description": "YESS'25 Ticket Purchase",
    "image": "https://example.com/yess_logo.png",
    "order_id": id,
    "theme": {
        "color": "#cc391c"
    },
    "handler": function (response) {
      // Payment successful, keep loading state active until callback completes
      console.log('Payment successful:', response);
      
      // Send payment response to backend callback endpoint using fetch
      fetch('https://yess25-backend.onrender.com/api/payment/success-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Callback response:', data);
        // Payment verification successful - redirect to success page
        window.location.href = '/paymentStatus';
      })
      .catch(error => {
        console.error('Callback error:', error);
        // Handle callback failure - redirect to error page or show alert
        alert('Payment verification failed. Please contact support.');
      });
    },
    "modal": {
      "ondismiss": function() {
        // Payment modal closed without completing payment
        paymentProcessingRef.current = false;
        // Try to update React state if possible
        if (window.updatePaymentProcessingState) {
          window.updatePaymentProcessingState(false);
        }
      }
    }
  };
  
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

function Tickets() {
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
    mode: 'onChange', // Enable real-time validation
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  
  // Global variable to track payment processing state
  const [paymentProcessingRef] = useState({ current: false });

  // Watch IEEE membership status for conditional validation
  const isIEEEMember = watch('isIEEEMember');

  // College dropdown state
  const [colleges, setColleges] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef(null);
  const [isOtherInstitution, setIsOtherInstitution] = useState(false);

  // Fetch colleges on mount
  useEffect(() => {
    axios.get('https://yess25-backend.onrender.com/api/colleges')
      .then(res => {
        console.log(res.data.colleges);
        setColleges(res.data.colleges || []);
      })
      .catch(() => {
        setColleges([]);
      });
  }, []);

  // Handle browser autofill events
  useEffect(() => {
    const handleAutofill = () => {
      // Small delay to ensure autofill has completed
      setTimeout(() => {
        const formData = getValues();
        let hasChanges = false;
        
        // Check each field for autofilled values
        const fieldsToCheck = ['fullName', 'email', 'phone', 'institution', 'course'];
        
        fieldsToCheck.forEach(fieldName => {
          const element = document.getElementById(fieldName);
          if (element && element.value && element.value !== formData[fieldName]) {
            setValue(fieldName, element.value, { shouldValidate: true });
            hasChanges = true;
          }
        });
        
        // Check select fields
        const selectFields = ['gender', 'foodPreference', 'yearOfStudy'];
        selectFields.forEach(fieldName => {
          const element = document.getElementById(fieldName);
          if (element && element.value && element.value !== formData[fieldName]) {
            setValue(fieldName, element.value, { shouldValidate: true });
            hasChanges = true;
          }
        });
        
        // Check radio buttons for IEEE membership
        const ieeeRadios = document.querySelectorAll('input[name="isIEEEMember"]');
        ieeeRadios.forEach(radio => {
          if (radio.checked && radio.value !== formData.isIEEEMember) {
            handleIEEEMemberChange(radio.value);
            hasChanges = true;
          }
        });
        
        // If any autofilled values were detected, trigger validation
        if (hasChanges) {
          trigger(); // Trigger validation for all fields
        }
      }, 100);
    };

    // Listen for autofill events
    const form = document.querySelector('form');
    if (form) {
      // Modern browsers support animationstart for autofill detection
      form.addEventListener('animationstart', (e) => {
        if (e.animationName.includes('autofill')) {
          handleAutofill();
        }
      });
      
      // Fallback: Listen for input events with a delay to catch autofill
      const inputs = form.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', handleAutofill);
        input.addEventListener('change', handleAutofill);
      });
      
      // Additional fallback: Check for autofill on focus
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
        setShowCollegeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup global function on unmount
  useEffect(() => {
    return () => {
      delete window.updatePaymentProcessingState;
    };
  }, []);

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

    // Additional validation check before submission
    const isValid = await trigger();
    if (!isValid) {
      setError('Please fill in all required fields correctly.');
      setIsLoading(false);
      return;
    }

    // Process institution data - if "Other" is selected, use the custom institution name
    let institutionValue = data.institution;
    if (data.institutionIsOther) {
      institutionValue = data.institutionOther;
    }
    
    // Create clean form data without the additional institution fields
    const { institutionIsOther, institutionOther, ...cleanData } = data;
    const formDataWithVerification = {
      ...cleanData,
      institution: institutionValue,
      ieeeVerificationCompleted: data.isIEEEMember === 'no',
      ieeeVerified: false
    };
    
    console.log(formDataWithVerification);
    try {
      const response = await axios.post('https://yess25-backend.onrender.com/api/payment', formDataWithVerification);
      const serverresponse = response.data;
      console.log('Registration successful:', serverresponse);
      
      // Set payment processing state and keep loading active
      setIsPaymentProcessing(true);
      paymentProcessingRef.current = true;
      document.cookie = `email=${serverresponse.notes.email}; path=/; max-age=${14*24*60*60}`;
      
      // Make the state setter available globally for the Razorpay handler
      window.updatePaymentProcessingState = setIsPaymentProcessing;
      
      // Display Razorpay with payment processing state management
      displayRazorpay(serverresponse.amount, serverresponse.id, paymentProcessingRef);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(error.response.message || 'This email is already registered');
      } else {
        setError('Error processing your registration. Please try again.');
      }
      console.error('Error checking email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle IEEE membership change
  const handleIEEEMemberChange = (value) => {
    setValue('isIEEEMember', value);
    setValue('ieeeMembershipNumber', ''); // Clear membership number when status changes
    // Clear the error for IEEE membership number when status changes
    if (errors.ieeeMembershipNumber) {
      clearErrors('ieeeMembershipNumber');
    }
    if (value === 'yes' || value === 'gsm') {
      trigger('ieeeMembershipNumber'); // Trigger validation for membership number
    }
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
              <h1 className="text-4xl font-bold text-white mb-8 text-center">Register for IEEE YESS'25</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
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
                    <ul className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-white/20 rounded-md max-h-48 overflow-y-auto shadow-lg">
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
                <Link 
                  to="/checkStatus" 
                  className="text-gray-400 hover:text-white transition-colors text-sm underline order-2 md:order-1"
                >
                  Check registration or retry failed payment
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading || isPaymentProcessing}
                  className={`w-full md:w-auto px-8 py-3 bg-[#fe4a56] text-white rounded-md hover:bg-[#8c0505] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold flex items-center justify-center gap-2 order-1 md:order-2 ${
                    (isSubmitting || isLoading || isPaymentProcessing) ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {(isSubmitting || isLoading || isPaymentProcessing) ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isPaymentProcessing ? 'Processing Payment...' : 'Processing...'}
                    </>
                  ) : (
                    'Register Now'
                  )}
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
        </main>

        <SubFooter />
      </div>
    </>
  );
}

export default Tickets;
