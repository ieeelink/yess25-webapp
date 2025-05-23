import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import axios from 'axios';

function Status() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get email from cookie
    const getEmailFromCookie = async () => {
      try {
        // Read cookie from /cookie/ path
        const cookies = document.cookie.split(';');
        const emailCookie = cookies.find(cookie => cookie.trim().startsWith('email='));
        const email = emailCookie ? decodeURIComponent(emailCookie.split('=')[1].trim()) : null;
        
        if (email) {
          // Send email to backend
          const statusResponse = await axios.post('/api/paymentstatus', { email });
          console.log('Payment status response:', statusResponse.data);
          setPaymentStatus(statusResponse.data);
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

  const getStatusMessage = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Your registration has been confirmed.';
      case 'FAILED':
        return 'There was an issue with your payment. Please try again.';
      case 'PENDING':
        return 'Your payment is being processed. Please wait.';
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
