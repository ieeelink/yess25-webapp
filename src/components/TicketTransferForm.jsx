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
	newCourse: yup.string().required('Course/Stream is required').min(2).max(50),
	newGender: yup.string().required('Gender is required').oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
	newFoodPreference: yup.string().required('Food preference is required').oneOf(['veg', 'non-veg'], 'Please select a valid food preference'),
	newYearOfStudy: yup.string().required('Year of study is required').oneOf(['1', '2', '3', '4', 'graduate_student'], 'Please select a valid year of study'),
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
	transferReason: yup.string().required('Please provide a reason for transfer').min(10).max(200),
});

const TicketTransferForm = ({ onClose, ticketData }) => {
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
	const newIsIEEEMember = watch('newIsIEEEMember');
	const [colleges, setColleges] = useState([]);
	const [collegeSearch, setCollegeSearch] = useState('');
	const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
	const collegeDropdownRef = useRef(null);
	const [isOtherInstitution, setIsOtherInstitution] = useState(false);
	const navigate = useNavigate();

	const handleIEEEMemberChange = (value) => {
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
		const { newInstitutionIsOther, newInstitutionOther, ...cleanData } = data;
		
		const transferData = {
			...cleanData,
			newInstitution: institutionValue,
			originalTicketData: ticketData,
		};
		
		try {
			await axios.post(`${API_ENDPOINTS.BASE_URL}/transfer-ticket`, transferData);
			setSuccess('Ticket transfer request submitted successfully! You will receive a confirmation email shortly.');
			setTimeout(() => { if (onClose) onClose(); else navigate('/'); }, 3000);
		} catch (error) {
			setError('Error processing your transfer request. Please try again or contact support.');
		} finally {
			setIsLoading(false);
		}
	};

	return ReactDOM.createPortal(
		<div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/70 backdrop-blur-sm min-h-screen overflow-y-auto py-8 pointer-events-auto">
			<div className="w-full max-w-7xl mx-auto px-4">
				<div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-white/20">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-left">Transfer Your Ticket</h1>
						<button type="button" aria-label="Close form" onClick={() => { if (onClose) return onClose(); navigate('/'); }} className="text-white hover:text-[#fe4a56] focus:outline-none p-2 rounded-full transition-colors">
							<MdClose className="w-7 h-7" />
						</button>
					</div>

					{/* Main Content - Two Column Layout on Desktop */}
					<div className="flex flex-col lg:flex-row">
						{/* Left Side - Current Ticket Details (Desktop) */}
						{ticketData && (
							<div className="lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-white/20">
								<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
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

						{/* Right Side - Transfer Form */}
						<div className="lg:w-3/5 p-6">
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* New Attendee Information */}
					<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
						<h2 className="text-xl font-semibold text-white mb-4">New Attendee Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label htmlFor="newFullName" className="block text-sm font-medium text-white mb-1">Full Name *</label>
								<input type="text" id="newFullName" {...register('newFullName')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newFullName ? 'border-red-500' : 'border-white/20'}`} placeholder="Enter new attendee's full name" />
								{errors.newFullName && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newFullName.message}</p>)}
							</div>
							<div>
								<label htmlFor="newGender" className="block text-sm font-medium text-white mb-1">Gender *</label>
								<select id="newGender" {...register('newGender')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.newGender ? 'border-red-500' : 'border-white/20'}`}>
									<option value="">Select gender</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="other">Other</option>
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
							<div>
								<label htmlFor="newCourse" className="block text-sm font-medium text-white mb-1">Course/Stream *</label>
								<input type="text" id="newCourse" {...register('newCourse')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 nunito-sans-body ${errors.newCourse ? 'border-red-500' : 'border-white/20'}`} placeholder="e.g., Computer Science" />
								{errors.newCourse && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newCourse.message}</p>)}
							</div>
							<div>
								<label htmlFor="newFoodPreference" className="block text-sm font-medium text-white mb-1">Food Preference *</label>
								<select id="newFoodPreference" {...register('newFoodPreference')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.newFoodPreference ? 'border-red-500' : 'border-white/20'}`}>
									<option value="">Select food preference</option>
									<option value="veg">Veg</option>
									<option value="non-veg">Non-Veg</option>
								</select>
								{errors.newFoodPreference && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newFoodPreference.message}</p>)}
							</div>
							<div>
								<label htmlFor="newYearOfStudy" className="block text-sm font-medium text-white mb-1">Year of Study *</label>
								<select id="newYearOfStudy" {...register('newYearOfStudy')} className={`w-full px-3 py-2 bg-white/5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white [&>option]:bg-[#1a1a1a] nunito-sans-body ${errors.newYearOfStudy ? 'border-red-500' : 'border-white/20'}`}>
									<option value="">Select year of study</option>
									<option value="1">First Year</option>
									<option value="2">Second Year</option>
									<option value="3">Third Year</option>
									<option value="4">Fourth Year</option>
								</select>
								{errors.newYearOfStudy && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newYearOfStudy.message}</p>)}
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-white mb-1">Is the new attendee an IEEE Member? *</label>
								<div className="flex gap-6 mt-2">
									<label className="inline-flex items-center">
										<input type="radio" name="newIsIEEEMember" value="yes" checked={newIsIEEEMember === 'yes'} onChange={e => handleIEEEMemberChange(e.target.value)} className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2" />
										<span className="ml-2 text-white nunito-sans-body">Yes</span>
									</label>
									<label className="inline-flex items-center">
										<input type="radio" name="newIsIEEEMember" value="no" checked={newIsIEEEMember === 'no'} onChange={e => handleIEEEMemberChange(e.target.value)} className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2" />
										<span className="ml-2 text-white nunito-sans-body">No</span>
									</label>
									<label className="inline-flex items-center">
										<input type="radio" name="newIsIEEEMember" value="gsm" checked={newIsIEEEMember === 'gsm'} onChange={e => handleIEEEMemberChange(e.target.value)} className="w-4 h-4 text-[#fe4a56] bg-white/5 border-white/20 focus:ring-[#fe4a56] focus:ring-2" />
										<span className="ml-2 text-white nunito-sans-body">Graduate Student Member</span>
									</label>
								</div>
								{errors.newIsIEEEMember && (<p className="text-red-500 text-sm mt-1 nunito-sans-body">{errors.newIsIEEEMember.message}</p>)}
							</div>
							<div className="md:col-span-2">
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
					<div className="flex flex-col md:flex-row justify-center items-center gap-4">
						<button type="submit" disabled={isSubmitting || isLoading} className={`group w-full md:w-auto px-8 py-3 text-white rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold flex items-center justify-center gap-2 animated-gradient min-w-[120px] hover:min-w-[220px] ${(isSubmitting || isLoading) ? 'opacity-75 cursor-not-allowed' : ''}`}>
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
					{success && (<div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-md"><p className="text-green-500 text-sm nunito-sans-body text-center">{success}</p></div>)}
					{isLoading && (<div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-md"><div className="flex items-center justify-center gap-3"><svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="text-blue-400 text-sm nunito-sans-body">Processing your transfer request... Please wait.</p></div></div>)}
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>,
		document.body
	);
};

export default TicketTransferForm;
