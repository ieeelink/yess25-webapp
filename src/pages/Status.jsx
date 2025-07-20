import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

let globalEmail = null;

function Status({ closeAllPopups }) {
  const { ticketId } = useParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Handler to open popup (for SubFooter)
  const handleContactClick = useCallback(() => setShowContactPopup(true), []);
  const handleCloseContactPopup = useCallback(() => setShowContactPopup(false), []);

  useEffect(() => {
    // Fetch email from cookie and get payment status
    const cookies = document.cookie.split(';');
    const emailCookie = cookies.find(cookie => cookie.trim().startsWith('email='));
    globalEmail = emailCookie ? decodeURIComponent(emailCookie.split('=')[1].trim()) : null;
    if (globalEmail) {
      fetchPaymentStatus(globalEmail);
    } else {
      setError('No registration email found. Please contact support.');
      setLoading(false);
    }

    // Remove email cookie on window unload
    const handleUnload = () => {
      document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };
    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  const fetchPaymentStatus = async (email) => {
    try {
      const statusResponse = await axios.post('https://yess25-backend.up.railway.app/api/paymentstatus', { email });
      console.log(statusResponse.data.payments[0]);
      setPaymentStatus(statusResponse.data.payments[0]);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No ticket found.');
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
      document.cookie = `email=${globalEmail}; path=/; max-age=${14*24*60*60}`;
      const response = await axios.post('https://yess25-backend.up.railway.app/api/retrypayment', { email: globalEmail });
      if (response.status === 200) {
        window.location.href = response.data.response.redirectUrl;
      }
    } catch (error) {
      setError('Failed to retry payment. Please try again later.');
      console.log(error);
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
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => {
                        if (closeAllPopups) closeAllPopups();
                        navigate('/');
                      }}
                      className="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 text-lg font-semibold"
                    >
                      Go to Home
                    </button>
                  </div>
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
                        <p className='nunito-sans-body'><span className="font-medium">Order ID:</span> {paymentStatus.order_id}</p>
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
                      <button
                        onClick={() => {
                          if (closeAllPopups) closeAllPopups();
                          navigate('/');
                        }}
                        className="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 text-lg font-semibold"
                      >
                        Go to Home
                      </button>
                    </div>
                  )}
                  {paymentStatus.status === 'paid' && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          if (closeAllPopups) closeAllPopups();
                          navigate('/');
                        }}
                        className="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 text-lg font-semibold"
                      >
                        Go to Home
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-white">
                  <p>No payment information found.</p>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        if (closeAllPopups) closeAllPopups();
                        navigate('/');
                      }}
                      className="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 text-lg font-semibold"
                    >
                      Go to Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
  );
}

export default Status;
