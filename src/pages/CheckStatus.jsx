import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Status from './Status';

function CheckStatus({ onClose }) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [submittedInput, setSubmittedInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmittedInput(userInput);
      setShowStatus(true);
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl px-4 sm:px-0">
      {showStatus ? (
        <Status closeAllPopups={onClose} userInput={submittedInput} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 text-center">Check Registration Status</h1>
          <div>
            <label htmlFor="userInput" className="block text-sm font-medium text-white mb-1">
              Ticket ID or Email Address
            </label>
            <input
              type="text"
              id="userInput"
              name="userInput"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter your ticket ID (e.g., YESS25-ABC123) or email address"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (typeof onClose === 'function') {
                  onClose();
                } else {
                  navigate(-1);
                }
              }}
              className="text-gray-400 hover:text-white transition-colors text-sm underline order-2 md:order-1"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full md:w-auto px-8 py-3 bg-[#fe4a56] text-white rounded-md hover:bg-[#8c0505] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 text-lg font-semibold flex items-center justify-center gap-2 order-1 md:order-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </>
              ) : (
                'Check Status'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CheckStatus;
