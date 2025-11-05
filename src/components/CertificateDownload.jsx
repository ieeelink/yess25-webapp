import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiX } from 'react-icons/fi';
import { API_BASE } from '../config/api';

function CertificateDownload({ onClose }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Requesting certificate for:', email);
      
      const response = await fetch(`${API_BASE}/public/certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
      });

      const result = await response.json();
      
      // ✅ Case 1 & 2: Success (200) or Partial Success (207) - Certificate available
      if (response.ok && result.success && result.data?.certificate) {
        console.log('✅ Certificate received from server');
        
        try {
          // Convert base64 to blob and trigger download
          const pdfData = atob(result.data.certificate.data);
          const pdfArray = new Uint8Array(pdfData.length);
          for (let i = 0; i < pdfData.length; i++) {
            pdfArray[i] = pdfData.charCodeAt(i);
          }
          
          const blob = new Blob([pdfArray], { type: result.data.certificate.mimeType || 'application/pdf' });
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.data.certificate.filename || `YESS25_Certificate_${result.data.ticketId}.pdf`;
          
          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up
          window.URL.revokeObjectURL(url);
          
          console.log('📥 Certificate download triggered');
          
          // Show appropriate success message based on email status
          if (result.data.emailFailure || result.warning) {
            // Case 2: Partial Success (207)
            setSuccess(result.message || 'Certificate generated and downloaded! However, email sending failed. Please check your downloads folder.');
          } else {
            // Case 1: Full Success (200)
            setSuccess(result.message || `Certificate generated and sent to ${result.data.sentTo || email}! Download has started automatically.`);
          }
          
          // Auto-close modal after 5 seconds
          setTimeout(() => {
            if (typeof onClose === 'function') {
              onClose();
            }
          }, 5000);
          
        } catch (downloadError) {
          console.error('❌ Download error:', downloadError);
          setError('Certificate was generated but download failed. Please try again.');
        }
        
      } 
      // ❌ Case 3: Attendance Not Marked (403)
      else if (response.status === 403 && result.error === 'Attendance not marked') {
        console.error('⚠️ Attendance not marked');
        setError(result.message || 'Certificate can only be generated after attendance has been marked. Please check in at the event first.');
      } 
      // ❌ Case 4: Certificate Already Sent (409)
      else if (response.status === 409 && result.error === 'Certificate already sent') {
        console.error('⚠️ Certificate already sent');
        const sentDate = result.data?.sentAt ? new Date(result.data.sentAt).toLocaleString() : '';
        setError(result.message || `A certificate has already been sent to this email${sentDate ? ` on ${sentDate}` : ''}. Please check your inbox or spam folder.`);
      } 
      // ❌ Case 5: Ticket Not Found (404)
      else if (response.status === 404 || result.error === 'Ticket not found') {
        console.error('❌ Ticket not found');
        setError(result.message || 'No ticket found for this email address. Please check your email or contact support.');
      } 
      // ❌ Case 6: Ticket Not Paid (400)
      else if (result.error === 'Ticket not paid') {
        console.error('⚠️ Ticket not paid');
        setError(result.message || 'Certificate can only be generated for paid tickets. Please complete your payment first.');
      } 
      // ❌ Case 7 & 8: Invalid Email or Email Required (400)
      else if (response.status === 400 && (result.error === 'Invalid email format' || result.error === 'Email is required')) {
        console.error('❌ Invalid email');
        setError(result.message || 'Please provide a valid email address.');
      } 
      // ❌ Case 9: Certificate Generation Failed (500)
      else if (result.error === 'Certificate generation failed') {
        console.error('❌ Certificate generation failed');
        setError(result.message || 'Unable to generate certificate PDF. Please try again later or contact support.');
      } 
      // ❌ Case 10: Internal Server Error (500)
      else if (response.status === 500 || result.error === 'Internal server error') {
        console.error('❌ Internal server error');
        setError(result.message || 'An unexpected error occurred on the server. Please try again later or contact support.');
      } 
      // ❌ Generic Error Fallback
      else {
        console.error('❌ Unknown error:', result);
        setError(result.message || result.error || 'An error occurred while processing your request. Please try again.');
      }
      
    } catch (err) {
      console.error('❌ Network/Parse error:', err);
      // Network error or JSON parse error
      if (err.name === 'SyntaxError') {
        setError('Invalid response from server. Please try again later.');
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error occurred. Please check your internet connection and try again.');
      } else {
        setError('An unexpected error occurred. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto flex items-center justify-center min-h-full py-4">
      <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-6 bg-white/10 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-white/20 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            if (typeof onClose === 'function') {
              onClose();
            } else {
              navigate(-1);
            }
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          aria-label="Close"
        >
          <FiX size={20} className="sm:w-6 sm:h-6" />
        </button>

        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <FiDownload className="text-[#fe4a56] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          <span className="leading-tight">Download Certificate</span>
        </h1>
        
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-3 sm:py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400 text-base sm:text-sm"
            placeholder="Enter your registered email address"
            disabled={isLoading || success}
          />
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Enter the email address you used when registering for the event
          </p>
        </div>

        {error && (
          <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500 rounded-md">
            <p className="text-red-400 text-sm sm:text-base leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 sm:p-4 bg-green-500/20 border border-green-500 rounded-md">
            <p className="text-green-400 text-sm sm:text-base leading-relaxed">{success}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              if (typeof onClose === 'function') {
                onClose();
              } else {
                navigate(-1);
              }
            }}
            className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base underline order-2 sm:order-1 py-2"
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading || success}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3 bg-[#fe4a56] text-white rounded-md hover:bg-[#8c0505] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 order-1 sm:order-2 min-h-[48px] ${
              (isLoading || success) ? 'opacity-75 cursor-not-allowed' : ''
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
            ) : success ? (
              <>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Certificate Generated
              </>
            ) : (
              <>
                <FiDownload className="h-5 w-5" />
                Generate & Download Certificate
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CertificateDownload;