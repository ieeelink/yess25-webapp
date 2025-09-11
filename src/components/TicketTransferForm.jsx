import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import planeLottie from './iCVMii0Ol1.json';
import { MdClose } from 'react-icons/md';
import { API_ENDPOINTS } from '../config/api';
import Status from '../pages/Status';

const validationSchema = yup.object({
	currentEmail: yup.string().required('Current email is required').email('Please enter a valid email address'),
	newFullName: yup.string().required('New attendee full name is required').min(2).max(50).matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
	newEmail: yup.string().required('New attendee email is required').email().max(100),
	newPhone: yup.string().required('Phone number is required').matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number').max(10, 'Phone number must be exactly 10 digits'),
	newInstitution: yup.string().when('newInstitutionIsOther', {
		is: true,
		then: (schema) => schema.required('Please specify your institution'),
		otherwise: (schema) => schema.required('College/Institution name is required')
	}).min(3).max(100),
	newCourse: yup.string().when('newCourseIsOther', {
		is: true,
		then: (schema) => schema.required('Please specify your course/stream'),
		otherwise: (schema) => schema.required('Course/Stream is required')
	}).min(2).max(50),
	newGender: yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender'),
	newFoodPreference: yup.string().required('Food preference is required').oneOf(['Veg', 'Non-Veg'], 'Please select a valid food preference'),
	newYearOfStudy: yup.string().required('Year of study is required').oneOf(['First Year', 'Second Year', 'Third Year', 'Fourth Year'], 'Please select a valid year of study'),
	newIsIEEEMember: yup.string().required('IEEE membership status is required').oneOf(['yes', 'no', 'gsm']),
	newIeeeMembershipNumber: yup.string().when('newIsIEEEMember', {
		is: (value) => value === 'yes' || value === 'gsm',
		then: (schema) => schema.required('IEEE membership number is required for IEEE members').matches(/^\d{8,10}$/, 'Please enter a valid IEEE membership number (8-10 digits)').max(10, 'IEEE membership number must not exceed 10 digits'),
		otherwise: (schema) => schema.optional(),
	}),
	newInstitutionIsOther: yup.boolean(),
	newInstitutionOther: yup.string().when('newInstitutionIsOther', {
		is: true,
		then: (schema) => schema.required('Please specify your institution').min(3).max(100),
		otherwise: (schema) => schema.optional(),
	}),
	newCourseIsOther: yup.boolean(),
	newCourseOther: yup.string().when('newCourseIsOther', {
		is: true,
		then: (schema) => schema.required('Please specify your course/stream').min(2).max(50),
		otherwise: (schema) => schema.optional(),
	}),
});

const TicketTransferForm = ({ onClose, ticketData, closeAllPopups }) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
		setValue,
		trigger,
		clearErrors,
		getValues,
	} = useForm({ resolver: yupResolver(validationSchema), mode: 'onChange' });

	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showStatus, setShowStatus] = useState(false);
	const [transferEmail, setTransferEmail] = useState('');
	const [showSuccessLoader, setShowSuccessLoader] = useState(false);
	const newIsIEEEMember = watch('newIsIEEEMember');
	const [colleges, setColleges] = useState([]);
	const [collegeSearch, setCollegeSearch] = useState('');
	const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
	const collegeDropdownRef = useRef(null);
	const [isOtherInstitution, setIsOtherInstitution] = useState(false);
	
	// Course/Stream state management
	const [courses] = useState([
		'Computer Science and Allied Courses',
		'Electrical and Allied Courses',
		'Electronics and Allied Courses',
		'Mechanical and Allied Courses',
		'Chemical and Allied Courses',
		'Civil and Allied Courses',
		'Biotechnology'
	]);
	const [courseSearch, setCourseSearch] = useState('');
	const [showCourseDropdown, setShowCourseDropdown] = useState(false);
	const courseDropdownRef = useRef(null);
	const [isOtherCourse, setIsOtherCourse] = useState(false);
	
	const navigate = useNavigate();

	// Define transfer constraints based on original ticket's IEEE membership
	const getTransferConstraints = () => {
		if (!ticketData || !ticketData.isIEEEMember) return { allowYes: true, allowNo: true, allowGsm: true };
		
		const originalStatus = ticketData.isIEEEMember;
		
		switch (originalStatus) {
			case 'yes': // IEEE member can transfer to anyone
				return { allowYes: true, allowNo: true, allowGsm: true };
			case 'gsm': // GSM can only transfer to GSM or non-IEEE
				return { allowYes: false, allowNo: true, allowGsm: true };
			case 'no': // Non-IEEE can only transfer to non-IEEE
				return { allowYes: false, allowNo: true, allowGsm: false };
			default:
				return { allowYes: true, allowNo: true, allowGsm: true };
		}
	};

	const transferConstraints = getTransferConstraints();

	const handleIEEEMemberChange = (value) => {
		// Check if the selected value is allowed based on transfer constraints
		const constraints = getTransferConstraints();
		const isAllowed = (value === 'yes' && constraints.allowYes) || 
						  (value === 'no' && constraints.allowNo) || 
						  (value === 'gsm' && constraints.allowGsm);
		
		if (!isAllowed) return; // Don't allow change to restricted option
		
		setValue('newIsIEEEMember', value);
		setValue('newIeeeMembershipNumber', '');
		if (errors.newIeeeMembershipNumber) {
			clearErrors('newIeeeMembershipNumber');
		}
		if (value === 'yes' || value === 'gsm') {
			trigger('newIeeeMembershipNumber');
		}
	};

	useEffect(() => {
		if (ticketData && ticketData.email) {
			setValue('currentEmail', ticketData.email);
			console.log(ticketData);
		}
		
		// Set default IEEE membership option based on transfer constraints
		const constraints = getTransferConstraints();
		if (ticketData && ticketData.isIEEEMember) {
			// Auto-select the first allowed option
			if (constraints.allowNo) {
				setValue('newIsIEEEMember', 'no');
			} else if (constraints.allowGsm) {
				setValue('newIsIEEEMember', 'gsm');
			} else if (constraints.allowYes) {
				setValue('newIsIEEEMember', 'yes');
			}
		}
	}, [ticketData, setValue]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => { document.body.style.overflow = 'unset'; };
	}, []);

	// Fetch colleges data
	useEffect(() => {
		axios.get(API_ENDPOINTS.COLLEGES)
			.then(res => {
				setColleges(res.data.colleges || []);
			})
			.catch(() => {
				setColleges([]);
			});
	}, []);

	// Handle autofill detection
	useEffect(() => {
		const handleAutofill = () => {
			setTimeout(() => {
				const formData = getValues();
				let hasChanges = false;
				const fieldsToCheck = ['newFullName', 'newEmail', 'newPhone', 'newInstitution', 'newCourse'];
				fieldsToCheck.forEach(fieldName => {
					const element = document.getElementById(fieldName);
					if (element && element.value && element.value !== formData[fieldName]) {
						setValue(fieldName, element.value, { shouldValidate: true });
						hasChanges = true;
					}
				});
				const selectFields = ['newGender', 'newFoodPreference', 'newYearOfStudy'];
				selectFields.forEach(fieldName => {
					const element = document.getElementById(fieldName);
					if (element && element.value && element.value !== formData[fieldName]) {
						setValue(fieldName, element.value, { shouldValidate: true });
						hasChanges = true;
					}
				});
				const ieeeRadios = document.querySelectorAll('input[name="newIsIEEEMember"]');
				ieeeRadios.forEach(radio => {
					if (radio.checked && radio.value !== formData.newIsIEEEMember) {
						handleIEEEMemberChange(radio.value);
						hasChanges = true;
					}
				});
				// Handle institution autofill
				const institutionOtherElement = document.getElementById('newInstitutionOther');
				if (institutionOtherElement && institutionOtherElement.value && institutionOtherElement.value !== formData.newInstitutionOther) {
					setValue('newInstitutionOther', institutionOtherElement.value, { shouldValidate: true });
					hasChanges = true;
				}
				// Handle course autofill
				const courseOtherElement = document.getElementById('newCourseOther');
				if (courseOtherElement && courseOtherElement.value && courseOtherElement.value !== formData.newCourseOther) {
					setValue('newCourseOther', courseOtherElement.value, { shouldValidate: true });
					hasChanges = true;
				}
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
	}, [setValue, trigger, getValues, handleIEEEMemberChange]);

	// Handle click outside college dropdown
	useEffect(() => {
		function handleClickOutside(event) {
			if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
				setShowCollegeDropdown(false);
			}
			if (courseDropdownRef.current && !courseDropdownRef.current.contains(event.target)) {
				setShowCourseDropdown(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const onSubmit = async (data) => {
		setError('');
		setSuccess('');
		const isValid = await trigger();
		if (!isValid) {
			setError('Please fill in all required fields correctly.');
			return;
		}
		setIsLoading(true);
		
		// Handle institution value (similar to TicketForm)
		let institutionValue = data.newInstitution;
		if (data.newInstitutionIsOther) {
			institutionValue = data.newInstitutionOther;
		}
		
		// Handle course value
		let courseValue = data.newCourse;
		if (data.newCourseIsOther) {
			courseValue = data.newCourseOther;
		}
		
		const { currentEmail, newInstitutionIsOther, newInstitutionOther, newCourseIsOther, newCourseOther, ...newAttendeeData } = data;
		
		// Transform new attendee data to match TicketForm structure
		const newTicketData = {
			fullName: newAttendeeData.newFullName,
			email: newAttendeeData.newEmail,
			phone: newAttendeeData.newPhone,
			institution: institutionValue,
			course: courseValue,
			gender: newAttendeeData.newGender,
			foodPreference: newAttendeeData.newFoodPreference,
			yearOfStudy: newAttendeeData.newYearOfStudy,
			isIEEEMember: newAttendeeData.newIsIEEEMember,
			ieeeMembershipNumber: newAttendeeData.newIeeeMembershipNumber || '',
			ieeeVerificationCompleted: newAttendeeData.newIsIEEEMember === 'no',
			ieeeVerified: false
		};
		
		// Transfer request data
		const transferData = {
			currentEmail,
			originalTicketId: ticketData?.registrationId,
			newTicketData
		};
		
		try {
			const registrationId = ticketData?.registrationId;
			if (!registrationId) {
				throw new Error('Registration ID not found');
			}
			
			const response = await axios.post(API_ENDPOINTS.TICKET_TRANSFER(registrationId), transferData);
			
			// Log the complete server response to console
			console.log('Server Response:', response);
			console.log('Response Status:', response.status);
			console.log('Response Data:', response.data);
			
			// Check response status
			if (response.status === 200) {
				// Success - transfer completed
				setSuccess('Ticket transfer request submitted successfully! You will receive a confirmation email shortly.');
				setShowSuccessLoader(true);
				setTransferEmail(response.data.newEmail || data.newEmail);
				
				// Wait for 3 seconds, then show status component
				setTimeout(() => {
					setShowSuccessLoader(false);
					setShowStatus(true);
				}, 3000);
			} else if (response.status === 300) {
				// Handle redirection - open NeetoForm with pre-filled data
				handleNeetoFormRedirection(data, institutionValue, courseValue);
			}
		} catch (error) {
			// Log the error response to console
			console.log('Error Response:', error);
			console.log('Error Response Status:', error.response?.status);
			console.log('Error Response Data:', error.response?.data);
			
			// Handle different error response codes
			if (error.response) {
				const { status, data: responseData } = error.response;
				
				switch (status) {
					case 300:
						// Redirection - open NeetoForm with pre-filled data
						handleNeetoFormRedirection(data, institutionValue, courseValue);
						break;
					
					case 400:
						// Bad Request
						const badRequestMsg = responseData?.error || 'Invalid request data. Please check your information and try again.';
						setError(badRequestMsg);
						break;
					
					case 404:
						// Not Found
						const notFoundMsg = responseData?.error || 'Ticket not found. Please verify your registration details.';
						setError(notFoundMsg);
						break;
					
					case 409:
						// Conflict
						const conflictMsg = responseData?.error || 'Transfer conflict detected. This ticket may have already been transferred.';
						setError(conflictMsg);
						break;
					
					case 500:
						// Internal Server Error
						const serverErrorMsg = responseData?.error || 'Server error occurred. Please try again later or contact support.';
						setError(serverErrorMsg);
						break;
					
					default:
						// Other HTTP errors
						const genericMsg = responseData?.error || 'An unexpected error occurred. Please try again or contact support.';
						setError(genericMsg);
						break;
				}
			} else {
				// Network or other errors
				setError('An unexpected error occurred. Please try again or contact support.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Function to handle NeetoForm redirection
	const handleNeetoFormRedirection = (formData, institutionValue, courseValue) => {
		// Transform form data to NeetoForm query parameters format
		const neetoFormParams = {
			full_name: formData.newFullName,
			email: formData.newEmail,
			phone: formData.newPhone,
			year_of_study: formData.newYearOfStudy,
			gender: formData.newGender,
			institution: institutionValue,
			stream: courseValue,
			food_preference: formData.newFoodPreference, // Already "Veg" or "Non-Veg"
			ieee_membership: getIEEEMembershipText(formData.newIsIEEEMember),
			membership_id: formData.newIeeeMembershipNumber || '',
			registrationId: ticketData?.registrationId || '',
			currentEmail: formData.currentEmail
		};

		// Check if neetoForm is available and embed the form
		if (typeof neetoForm !== 'undefined') {
			// Re-embed the form with new query parameters
			neetoForm.embed({
				type: "elementClick",
				id: "c7fc2391-78a3-44da-8f86-6b108a84da4c",
				organization: "ieeelink",
				elementSelector: "#ticket-transfer-neeto-button",
				queryParams: neetoFormParams,
			});

			// Small delay to ensure the embedding is complete, then trigger the click
			setTimeout(() => {
				const neetoButton = document.getElementById('ticket-transfer-neeto-button');
				if (neetoButton) {
					neetoButton.click();
					// Close all popups after NeetoForm opens
					if (closeAllPopups) {
						closeAllPopups();
					}
				} else {
					setError('Form service initialization failed. Please try again later.');
				}
			}, 100);
		} else {
			setError('Form service is not available. Please try again later.');
		}
	};

	// Helper function to convert year of study to display text
	const getYearOfStudyText = (value) => {
		// Value is already in correct format from form
		return value;
	};

	// Helper function to convert IEEE membership to display text
	const getIEEEMembershipText = (value) => {
		switch(value) {
			case 'yes': return 'IEEE Member';
			case 'gsm': return 'Graduate Student Member';
			case 'no': return 'Non IEEE Member';
			default: return value;
		}
	};

	return ReactDOM.createPortal(
		showStatus ? (
			<div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm min-h-screen overflow-y-auto py-8 pointer-events-auto">
				<div className="w-full max-w-2xl px-4 sm:px-0">
					<Status closeAllPopups={closeAllPopups || onClose} ticketId={ticketData?.order_id} email={transferEmail} />
				</div>
			</div>
		) : (
		<div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/70 backdrop-blur-sm min-h-screen overflow-y-auto py-8 pointer-events-auto">
			<div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
				<div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-white/20">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-left">Transfer Your Ticket</h1>
						<button type="button" aria-label="Close form" onClick={() => { if (onClose) return onClose(); navigate('/'); }} className="text-white hover:text-[#fe4a56] focus:outline-none p-2 rounded-full transition-colors">
							<MdClose className="w-7 h-7" />
						</button>
					</div>

					{/* Main Content - Responsive Layout */}
					<div className="flex flex-col lg:flex-row">
						{/* Current Ticket Details - Left side on desktop, top on mobile */}
						{ticketData && (
							<div className="lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-white/20">
								<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 lg:sticky lg:top-6">
									<h2 className="text-xl font-semibold text-white mb-4">Current Ticket Details</h2>
									<div className="grid grid-cols-1 gap-4 text-sm">
										<div>
											<span className="text-white/60">Name:</span>
											<p className="text-white font-medium">{ticketData.name}</p>
										</div>
										<div>
											<span className="text-white/60">Email:</span>
											<p className="text-white font-medium">{ticketData.email}</p>
										</div>
										<div>
											<span className="text-white/60">Institution:</span>
											<p className="text-white font-medium">{ticketData.institution}</p>
										</div>
										<div>
											<span className="text-white/60">IEEE Member:</span>
											<p className="text-white font-medium">{ticketData.isIEEEMember === 'yes' ? 'Yes' : ticketData.isIEEEMember === 'gsm' ? 'Graduate Student Member' : 'No'}</p>
										</div>
										<div>
											<span className="text-white/60">Ticket ID:</span>
											<p className="text-white font-medium">{ticketData.order_id}</p>
										</div>
										<div>
											<span className="text-white/60">Status:</span>
											<p className="text-white font-medium">{ticketData.status ? ticketData.status.charAt(0).toUpperCase() + ticketData.status.slice(1) : 'N/A'}</p>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Transfer Form - Right side on desktop, bottom on mobile */}
						<div className="lg:w-3/5 p-6">
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* New Attendee Information */}
					<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
						<h2 className="text-xl font-semibold text-white mb-4">New Attendee Information</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div>
								<label htmlFor="newFullName" className="block text-sm font-medium text-white mb-1">Full Name *</label>
								<input type="text" id="newFullName" {...register('newFullName')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newFullName ? 'border-red-500' : 'border-white/20'}`} placeholder="Enter new attendee's full name" />
								{errors.newFullName && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newFullName.message}</p>)}
							</div>
							<div>
								<label htmlFor="newGender" className="block text-sm font-medium text-white mb-1">Gender *</label>
								<select id="newGender" {...register('newGender')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.newGender ? 'border-red-500' : 'border-white/20'}`}>
									<option value="">Select gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
								{errors.newGender && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newGender.message}</p>)}
							</div>
							<div>
								<label htmlFor="newEmail" className="block text-sm font-medium text-white mb-1">Email Address *</label>
								<input type="email" id="newEmail" {...register('newEmail')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newEmail ? 'border-red-500' : 'border-white/20'}`} placeholder="Enter new attendee's email address" />
								{errors.newEmail && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newEmail.message}</p>)}
							</div>
							<div>
								<label htmlFor="newPhone" className="block text-sm font-medium text-white mb-1">Phone Number *</label>
								<input 
									type="tel" 
									id="newPhone" 
									{...register('newPhone')} 
									onInput={e => {
										e.target.value = e.target.value.replace(/\D/g, '');
									}}
									className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newPhone ? 'border-red-500' : 'border-white/20'}`} 
									placeholder="Enter 10-digit mobile number" 
									maxLength="10" 
								/>
								{errors.newPhone && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newPhone.message}</p>)}
							</div>
							<div ref={collegeDropdownRef} className="relative">
								<label htmlFor="newInstitution" className="block text-sm font-medium text-white mb-1">College/Institution *</label>
								<input
									type="text"
									id="newInstitution"
									autoComplete="off"
									{...register('newInstitution')}
									value={isOtherInstitution ? 'Other' : (collegeSearch !== '' ? collegeSearch : (watch('newInstitution') || ''))}
									onChange={e => {
										setCollegeSearch(e.target.value);
										setValue('newInstitution', e.target.value, { shouldValidate: true });
										setIsOtherInstitution(false);
										setValue('newInstitutionIsOther', false);
										setShowCollegeDropdown(true);
									}}
									onFocus={() => setShowCollegeDropdown(true)}
									className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newInstitution ? 'border-red-500' : 'border-white/20'}`}
									placeholder="Search or enter college name"
									readOnly={isOtherInstitution}
								/>
								{showCollegeDropdown && (
									<ul className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-white/20 rounded-md max-h-48 overflow-y-auto shadow-lg custom-scrollbar">
										<li
											className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white font-semibold nunito-sans-body"
											onClick={() => {
												setIsOtherInstitution(true);
												setValue('newInstitution', 'Other', { shouldValidate: true });
												setValue('newInstitutionIsOther', true);
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
													setValue('newInstitution', college, { shouldValidate: true });
													setCollegeSearch(college);
													setIsOtherInstitution(false);
													setValue('newInstitutionIsOther', false);
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
								{errors.newInstitution && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newInstitution.message}</p>)}
							</div>
							{/* If Other is selected, show extra input */}
							{isOtherInstitution && (
								<div>
									<label htmlFor="newInstitutionOther" className="block text-sm font-medium text-white mb-1">Please specify your institution *</label>
									<input
										type="text"
										id="newInstitutionOther"
										{...register('newInstitutionOther')}
										className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newInstitutionOther ? 'border-red-500' : 'border-white/20'}`}
										placeholder="Enter your institution name"
									/>
									{errors.newInstitutionOther && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newInstitutionOther.message}</p>)}
								</div>
							)}
							<div ref={courseDropdownRef} className="relative">
								<label htmlFor="newCourse" className="block text-sm font-medium text-white mb-1">Course/Stream *</label>
								<input
									type="text"
									id="newCourse"
									autoComplete="off"
									{...register('newCourse')}
									value={isOtherCourse ? 'Other' : (courseSearch !== '' ? courseSearch : (watch('newCourse') || ''))}
									onChange={e => {
										setCourseSearch(e.target.value);
										setValue('newCourse', e.target.value, { shouldValidate: true });
										setIsOtherCourse(false);
										setValue('newCourseIsOther', false);
										setShowCourseDropdown(true);
									}}
									onFocus={() => setShowCourseDropdown(true)}
									className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newCourse ? 'border-red-500' : 'border-white/20'}`}
									placeholder="Search or enter course/stream"
									readOnly={isOtherCourse}
								/>
								{showCourseDropdown && (
									<ul className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-white/20 rounded-md max-h-48 overflow-y-auto shadow-lg custom-scrollbar">
										<li
											className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white font-semibold nunito-sans-body"
											onClick={() => {
												setIsOtherCourse(true);
												setValue('newCourse', 'Other', { shouldValidate: true });
												setValue('newCourseIsOther', true);
												setShowCourseDropdown(false);
											}}
										>
											Other
										</li>
										{courses.filter(course =>
											course.toLowerCase().includes((courseSearch || '').toLowerCase())
										).map((course) => (
											<li
												key={course}
												className="px-4 py-2 cursor-pointer hover:bg-[#fe4a56] hover:text-white text-white nunito-sans-body"
												onClick={() => {
													setValue('newCourse', course, { shouldValidate: true });
													setCourseSearch(course);
													setIsOtherCourse(false);
													setValue('newCourseIsOther', false);
													setShowCourseDropdown(false);
												}}
											>
												{course}
											</li>
										))}
										{courses.filter(course =>
											course.toLowerCase().includes((courseSearch || '').toLowerCase())
										).length === 0 && (
											<li className="px-4 py-2 text-gray-400 nunito-sans-body">No results found</li>
										)}
									</ul>
								)}
								{errors.newCourse && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newCourse.message}</p>)}
							</div>
							{/* If Other is selected, show extra input */}
							{isOtherCourse && (
								<div>
									<label htmlFor="newCourseOther" className="block text-sm font-medium text-white mb-1">Please specify your course/stream *</label>
									<input
										type="text"
										id="newCourseOther"
										{...register('newCourseOther')}
										className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newCourseOther ? 'border-red-500' : 'border-white/20'}`}
										placeholder="Enter your course/stream"
									/>
									{errors.newCourseOther && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newCourseOther.message}</p>)}
								</div>
							)}
							<div>
								<label htmlFor="newFoodPreference" className="block text-sm font-medium text-white mb-1">Food Preference *</label>
								<select id="newFoodPreference" {...register('newFoodPreference')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.newFoodPreference ? 'border-red-500' : 'border-white/20'}`}>
									<option value="">Select food preference</option>
									<option value="Veg">Veg</option>
									<option value="Non-Veg">Non-Veg</option>
								</select>
								{errors.newFoodPreference && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newFoodPreference.message}</p>)}
							</div>
							<div>
								<label htmlFor="newYearOfStudy" className="block text-sm font-medium text-white mb-1">Year of Study *</label>
								<select id="newYearOfStudy" {...register('newYearOfStudy')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.newYearOfStudy ? 'border-red-500' : 'border-white/20'}`}>
									<option value="">Select year of study</option>
									<option value="First Year">First Year</option>
									<option value="Second Year">Second Year</option>
									<option value="Third Year">Third Year</option>
									<option value="Fourth Year">Fourth Year</option>
								</select>
								{errors.newYearOfStudy && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newYearOfStudy.message}</p>)}
							</div>
							<div className="lg:col-span-2">
								<label className="block text-sm font-medium text-white mb-1">Is the new attendee an IEEE Member? *</label>
								<div className="flex gap-6 mt-2">
									<label className={`inline-flex items-center ${!transferConstraints.allowYes ? 'opacity-50 cursor-not-allowed' : ''}`}>
										<input 
											type="radio" 
											name="newIsIEEEMember" 
											value="yes" 
											checked={newIsIEEEMember === 'yes'} 
											onChange={e => handleIEEEMemberChange(e.target.value)} 
											disabled={!transferConstraints.allowYes}
											className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed" 
										/>
										<span className="ml-2 text-white nunito-sans-body">Yes</span>
									</label>
									<label className={`inline-flex items-center ${!transferConstraints.allowNo ? 'opacity-50 cursor-not-allowed' : ''}`}>
										<input 
											type="radio" 
											name="newIsIEEEMember" 
											value="no" 
											checked={newIsIEEEMember === 'no'} 
											onChange={e => handleIEEEMemberChange(e.target.value)} 
											disabled={!transferConstraints.allowNo}
											className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed" 
										/>
										<span className="ml-2 text-white nunito-sans-body">No</span>
									</label>
									<label className={`inline-flex items-center ${!transferConstraints.allowGsm ? 'opacity-50 cursor-not-allowed' : ''}`}>
										<input 
											type="radio" 
											name="newIsIEEEMember" 
											value="gsm" 
											checked={newIsIEEEMember === 'gsm'} 
											onChange={e => handleIEEEMemberChange(e.target.value)} 
											disabled={!transferConstraints.allowGsm}
											className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed" 
										/>
										<span className="ml-2 text-white nunito-sans-body">Graduate Student Member</span>
									</label>
								</div>
								{/* Transfer constraint message */}
								{ticketData && ticketData.isIEEEMember && (
									<p className="text-yellow-400 text-sm nunito-sans-body pt-2">
										{ticketData.isIEEEMember === 'gsm' && 
											"Graduate Student Member tickets can only be transferred to Graduate Student Members or Non-IEEE members."
										}
										{ticketData.isIEEEMember === 'no' && 
											"Non-IEEE member tickets can only be transferred to Non-IEEE members."
										}
									</p>
								)}
								{errors.newIsIEEEMember && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newIsIEEEMember.message}</p>)}
								
							</div>
							<div className="lg:col-span-2">
								<label htmlFor="newIeeeMembershipNumber" className="block text-sm font-medium text-white mb-1">IEEE Membership Number {(newIsIEEEMember === 'yes' || newIsIEEEMember === 'gsm') && '*'}</label>
								<input 
									type="text" 
									id="newIeeeMembershipNumber" 
									{...register('newIeeeMembershipNumber')} 
									disabled={newIsIEEEMember !== 'yes' && newIsIEEEMember !== 'gsm'} 
									inputMode="numeric" 
									pattern="[0-9]*" 
									onInput={e => { 
										e.target.value = e.target.value.replace(/\D/g, ''); 
									}} 
									className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed nunito-sans-body ${errors.newIeeeMembershipNumber ? 'border-red-500' : 'border-white/20'}`} 
									placeholder={(newIsIEEEMember === 'yes' || newIsIEEEMember === 'gsm') ? "Enter IEEE membership number" : "Not applicable"} 
									maxLength="10" 
								/>
								{errors.newIeeeMembershipNumber && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newIeeeMembershipNumber.message}</p>)}
							</div>
						</div>
					</div>
					<div className="flex flex-col lg:flex-row justify-center items-center gap-4">
						<button type="submit" disabled={isSubmitting || isLoading} className={`group w-full lg:w-auto px-8 py-3 text-white rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold flex items-center justify-center gap-2 animated-gradient min-w-[120px] hover:min-w-[220px] ${(isSubmitting || isLoading) ? 'opacity-75 cursor-not-allowed' : ''}`}>
							<span className="flex items-center justify-center relative">
								Submit Transfer Request
								<span className="inline-block">
									<AnimatePresence initial={false} mode="wait">
										{(isSubmitting || isLoading) && (
											<motion.span key={`lottie-plane`} initial={{ opacity: 0, width: 0, marginLeft: 0 }} animate={{ opacity: 1, width: 24, marginLeft: 8 }} exit={{ opacity: 0, width: 0, marginLeft: 0 }} transition={{ duration: 0.3 }} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
												<Lottie animationData={planeLottie} loop={isSubmitting || isLoading} autoplay={isSubmitting || isLoading} style={{ width: 36, height: 36 }} rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} isClickToPauseDisabled={true} />
											</motion.span>
										)}
									</AnimatePresence>
								</span>
							</span>
						</button>
					</div>
					{error && (<div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-md"><p className="text-red-500 text-sm nunito-sans-body text-center">{error}</p></div>)}
					{success && (
						<div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-md">
							<p className="text-green-500 text-sm nunito-sans-body text-center">{success}</p>
							{showSuccessLoader && (
								<div className="flex items-center justify-center gap-3 mt-3">
									<svg className="animate-spin h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<p className="text-green-400 text-sm nunito-sans-body">Redirecting to status page...</p>
								</div>
							)}
						</div>
					)}
					{isLoading && (<div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-md"><div className="flex items-center justify-center gap-3"><svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="text-blue-400 text-sm nunito-sans-body">Processing your transfer request... Please wait.</p></div></div>)}
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* Hidden button for NeetoForm elementClick targeting */}
			<button 
				id="ticket-transfer-neeto-button" 
				style={{ display: 'none' }}
				aria-hidden="true"
			>
				Hidden NeetoForm Trigger
			</button>
		</div>
		),
		document.body
	);
};

export default TicketTransferForm;
