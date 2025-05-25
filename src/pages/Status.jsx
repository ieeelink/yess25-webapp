import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Global constant for email
let globalEmail = null;

function Status() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from cookie
    const getEmailFromCookie = async () => {
      try {
        // Read cookie from /cookie/ path
        const cookies = document.cookie.split(';');
        const emailCookie = cookies.find(cookie => cookie.trim().startsWith('email='));
        globalEmail = emailCookie ? decodeURIComponent(emailCookie.split('=')[1].trim()) : null;
        
        if (globalEmail) {
          // Send email to backend
          const statusResponse = await axios.post('/api/paymentstatus', { email: globalEmail });
          console.log('Payment status response:', statusResponse.data);
          setPaymentStatus(statusResponse.data);
          document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } else {
          setError('No registration email found. Please contact support.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to process registration. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    getEmailFromCookie();
  }, []);

  const handleRetryPayment = async () => {
    try {
      setLoading(true);
      document.cookie = `email=${globalEmail}; path=/; max-age=${14*24*60*60}`;
      const response = await axios.post('/api/retrypayment', { email: globalEmail });
      console.log(response);
      if (response.status === 200) {
        window.location.href = response.data.response.redirectUrl;
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
      setError('Failed to retry payment. Please try again later.');
      setLoading(false);
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Your registration has been confirmed. Tickets will be sent to your email after generation.';
      case 'FAILED':
        return 'There was an issue with your payment. Please try again.';
      case 'PENDING':
        return 'Your payment is not completed. If the payment is already debited from your account, please contact support.';
      default:
        return 'Unknown payment status.';
    }
  };

  return (
    <>
      <BgAnimation />
      <div className="min-h-screen flex flex-col relative">
        <Header />
        
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
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
                    paymentStatus.status === 'COMPLETED' 
                      ? 'bg-green-500/20 border border-green-500' 
                      : paymentStatus.status === 'PENDING'
                      ? 'bg-yellow-500/20 border border-yellow-500'
                      : 'bg-red-500/20 border border-red-500'
                  }`}>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      {paymentStatus.status === 'COMPLETED' 
                        ? 'Payment Successful!' 
                        : paymentStatus.status === 'PENDING'
                        ? 'Payment Pending'
                        : 'Payment Failed'}
                    </h2>
                    <p className="text-white/80">
                      {getStatusMessage(paymentStatus.status)}
                    </p>
                  </div>
                  
                  {paymentStatus.status === 'COMPLETED' && (
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h3 className="text-xl font-semibold text-white mb-4">Registration Details</h3>
                      <div className="space-y-2 text-white/80">
                        <p><span className="font-medium">Name:</span> {paymentStatus.fullName}</p>
                        <p><span className="font-medium">Email:</span> {paymentStatus.email}</p>
                      </div>
                    </div>
                  )}

                  {(paymentStatus.status === 'FAILED' || paymentStatus.status === 'PENDING') && (
                    <div className="flex justify-center">
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
            </div>
          </div>
        </main>

        <SubFooter />
      </div>
    </>
  );
}

export default Status;
