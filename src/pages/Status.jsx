import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import TicketTransferForm from '../components/TicketTransferForm';

let globalUserInput = null;
let globalInputType = null; // 'email' or 'ticketId'

function Status({ closeAllPopups, userInput, ticketId, email }) {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);

  // Helper function to identify if input is email or ticket ID
  const identifyInputType = (input) => {
    if (!input) return null;
    
    // Check if it's an email using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(input)) {
      return 'email';
    } else {
      // Assume it's a ticket ID if it's not an email
      return 'ticketId';
    }
  };

  useEffect(() => {
    // Determine which input to use - priority: userInput, then email, then ticketId
    const inputToUse = userInput || email || ticketId;
    
    if (inputToUse) {
      globalUserInput = inputToUse;
      globalInputType = identifyInputType(inputToUse);
      fetchPaymentStatus(inputToUse, globalInputType);
    } else {
      setError('No input provided. Please try again.');
      setLoading(false);
    }
  }, [userInput, email, ticketId]);

  const fetchPaymentStatus = async (input, inputType) => {
    try {
      let requestBody = {};
      
      // Build request body based on input type
      if (inputType === 'email') {
        requestBody = { email: input };
      } else if (inputType === 'ticketId') {
        requestBody = { ticketId: input };
      } else {
        throw new Error('Invalid input type');
      }

      const statusResponse = await axios.post(API_ENDPOINTS.PAYMENT_STATUS, requestBody);
      setPaymentStatus(statusResponse.data.payments[0]);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Use the error message from response body if available
        const errorMessage = error.response.data?.message || error.response.data?.error || 'No ticket found.';
        setError(errorMessage);
      } else if (error.response && error.response.data) {
        // Use the error message from response body for other errors
        const errorMessage = error.response.data.message || error.response.data.error || 'Failed to fetch payment status. Please contact support.';
        setError(errorMessage);
      } else {
        setError('Failed to fetch payment status. Please contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    try {
      setLoading(true);
      
      // For retry payment, we need to use ticket ID
      // If the original input was email, we should have the ticket ID from the response
      let retryRequestBody = {};
      
      if (globalInputType === 'ticketId') {
        retryRequestBody = { ticketId: globalUserInput };
      } else if (paymentStatus && paymentStatus.order_id) {
        // Use the ticket ID from the payment status response
        retryRequestBody = { ticketId: paymentStatus.order_id };
      } else {
        throw new Error('Unable to retry payment: No ticket ID available');
      }

      const response = await axios.post(API_ENDPOINTS.RETRY_PAYMENT, retryRequestBody);
      if (response.status === 200) {
        window.location.href = response.data.response.redirectUrl;
      }
    } catch (error) {
      // Use the error message from response body if available
      let errorMessage = 'Failed to retry payment. Please try again later.';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'paid':
        return 'Your registration has been confirmed. Tickets will be sent to your email after generation.';
      case 'attempted':
        return 'There was an issue with your payment. Please try again.';
      case 'created':
        return 'Your payment is not completed. If the payment is already debited from your account, please contact support.';
      default:
        return 'Unknown payment status.';
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="w-full max-w-2xl mx-auto my-16">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Payment Status</h1>
          {loading ? (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4">Processing your registration...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-500">
              <h2 className="text-2xl font-semibold text-white mb-2">Error</h2>
              <p className="text-white/80">{error}</p>
            </div>
          ) : paymentStatus ? (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg ${
                paymentStatus.status === 'paid' 
                  ? 'bg-green-500/20 border border-green-500' 
                  : paymentStatus.status === 'created'
                  ? 'bg-yellow-500/20 border border-yellow-500'
                  : 'bg-red-500/20 border border-red-500'
              }`}>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {paymentStatus.status === 'paid' 
                    ? 'Payment Successful!' 
                    : paymentStatus.status === 'created'
                    ? 'Payment Pending'
                    : 'Payment Failed'}
                </h2>
                <p className="text-white/80 nunito-sans-body">
                  {getStatusMessage(paymentStatus.status)}
                </p>
                {paymentStatus.reason && (
                  <p className="text-white/80 mt-2">
                    <span className="font-medium">Reason:</span> {paymentStatus.reason}
                  </p>
                )}
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Registration Details</h3>
                <div className="space-y-2 text-white/80">
                  <p className='nunito-sans-body'><span className="font-medium">Name:</span> {paymentStatus.name}</p>
                  <p className='nunito-sans-body'><span className="font-medium">Email:</span> {paymentStatus.email}</p>
                  {paymentStatus.order_id && (
                    <p className='nunito-sans-body'><span className="font-medium">YESS Ticket ID:</span> {paymentStatus.order_id}</p>
                  )}
                  {paymentStatus.status && (
                    <p className='nunito-sans-body'><span className="font-medium">Status:</span> {paymentStatus.status.charAt(0).toUpperCase() + paymentStatus.status.slice(1)}</p>
                  )}
                  
                </div>
                
              </div>
              {(paymentStatus.status === 'attempted' || paymentStatus.status === 'created') && (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleRetryPayment}
                    disabled={loading}
                    className={`px-8 py-3 bg-[#fe4a56] text-white rounded-md hover:bg-[#8c0505] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold flex items-center justify-center gap-2 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Retry Payment'
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-white">
              <p>No payment information found.</p>
            </div>
          )}
          
          {/* Default Go to Home button - always visible */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => {
                if (closeAllPopups) closeAllPopups();
              }}
              className="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 text-lg font-semibold"
            >
              Go to Home
            </button>
            {paymentStatus && paymentStatus.status === 'paid' && globalInputType === 'ticketId' && (
              <button
                onClick={() => setShowTransferForm(true)}
                className="px-8 py-3 bg-[#fe4a56] text-white rounded-md hover:bg-[#8c0505] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold"
              >
                Transfer Ticket
              </button>
            )}
          </div>
          
        </div>
      </div>
      
      {/* Show TicketTransferForm modal if showTransferForm is true */}
      {showTransferForm && (
        <TicketTransferForm
          onClose={() => setShowTransferForm(false)}
          ticketData={paymentStatus}
          closeAllPopups={closeAllPopups}
        />
      )}
    </>
  );
}

export default Status;
