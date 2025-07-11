import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BgAnimation from '../components/BgAnimation';

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment details from URL parameters
        const razorpay_order_id = searchParams.get('razorpay_order_id');
        const razorpay_payment_id = searchParams.get('razorpay_payment_id');
        const razorpay_signature = searchParams.get('razorpay_signature');

        console.log('Payment callback received:', {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        });

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          throw new Error('Missing payment parameters');
        }

        // Send verification data to backend
        const verificationData = {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        };

        console.log('Sending verification data to backend:', verificationData);

        const response = await axios.post('http://localhost:3001/api/payment/success-callback', verificationData);
        
        console.log('Backend verification response:', response.data);

        if (response.data.success) {
          // Store order ID in cookie for status page
          document.cookie = `order_id=${encodeURIComponent(razorpay_order_id)}; path=/; max-age=${14*24*60*60}`;
          setStatus('success');
          
          // Redirect to status page after a short delay
          setTimeout(() => {
            navigate('/paymentStatus');
          }, 2000);
        } else {
          throw new Error(response.data.error || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setError(error.response?.data?.error || error.message || 'Payment verification failed');
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <>
      <BgAnimation />
      <div className="min-h-screen flex flex-col relative">
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
              <h1 className="text-4xl font-bold text-white mb-8 text-center">Payment Processing</h1>
              
              {status === 'processing' && (
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-lg">Verifying your payment...</p>
                  <p className="text-sm text-gray-300 mt-2">Please wait while we process your transaction.</p>
                </div>
              )}

              {status === 'success' && (
                <div className="text-center text-white">
                  <div className="text-green-400 text-6xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
                  <p className="text-lg">Your payment has been verified successfully.</p>
                  <p className="text-sm text-gray-300 mt-2">Redirecting to status page...</p>
                </div>
              )}

              {status === 'error' && (
                <div className="text-center text-white">
                  <div className="text-red-400 text-6xl mb-4">✗</div>
                  <h2 className="text-2xl font-bold mb-4">Payment Verification Failed</h2>
                  <p className="text-lg mb-4">{error}</p>
                  <button
                    onClick={() => navigate('/tickets')}
                    className="bg-[#fe4a56] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8c0505] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default PaymentCallback; 