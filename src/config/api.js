// API Configuration
// Automatically switches between localhost and production based on environment

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yess25-backend.up.railway.app/api';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  ADMIN_VERIFY: `${API_BASE_URL}/admin/verify`,
  ADMIN_CHANGE_PASSWORD: `${API_BASE_URL}/admin/changepassword`,
  ADMIN_ADD_USER: `${API_BASE_URL}/admin/adduser`,
  
  // Payment
  PAYMENT: `${API_BASE_URL}/payment`,
  PAYMENT_SUCCESS_CALLBACK: `${API_BASE_URL}/payment/success-callback`,
  PAYMENT_STATUS: `${API_BASE_URL}/paymentstatus`,
  RETRY_PAYMENT: `${API_BASE_URL}/retrypayment`,
  
  // Data
  COLLEGES: `${API_BASE_URL}/colleges`,
  ADMIN_DATA: `${API_BASE_URL}/admin/data`,
  
  // Updates
  UPDATES: `${API_BASE_URL}/updates`,
  DELETE_UPDATE: (id) => `${API_BASE_URL}/updates/${id}`,
  
  // Events
  EVENTS: `${API_BASE_URL}/events`,
  DELETE_EVENT: (id) => `${API_BASE_URL}/events/${id}`,
  
  // IEEE Verification
  VERIFY_IEEE: (ticketId) => `${API_BASE_URL}/verifyieee/${ticketId}`,
};

// Export the base URL for custom endpoints
export const API_BASE = API_BASE_URL;

// Helper function to get current environment info
export const getEnvironmentInfo = () => {
  return {
    mode: import.meta.env.MODE,
    baseUrl: API_BASE_URL,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };
};

// Log current environment (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', getEnvironmentInfo());
}