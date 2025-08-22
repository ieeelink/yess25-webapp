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
  ADMIN_ADD_TICKET: `${API_BASE_URL}/admin/addticket`,
  ADMIN_ADD_BULK_TICKETS: `${API_BASE_URL}/admin/addbulktickets`,
  ADMIN_UPDATE_TICKET: (id) => `${API_BASE_URL}/admin/update-ticket/${id}`,
  ADMIN_GENERATE_INVOICE: (ticketId) => `${API_BASE_URL}/admin/generate-invoice/${ticketId}`,
  ADMIN_WEBHOOK_RESOLVE: `${API_BASE_URL}/ticket_webhook`,
  
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
  PUBLIC_UPDATES: `${API_BASE_URL}/public/updates`,
  LATEST_UPDATE: `${API_BASE_URL}/public/latest-update`,
  DELETE_UPDATE: (id) => `${API_BASE_URL}/updates/${id}`,
  
  // Events
  EVENTS: `${API_BASE_URL}/events`,
  DELETE_EVENT: (id) => `${API_BASE_URL}/events/${id}`,
  
  // IEEE Verification
  VERIFY_IEEE: (ticketId) => `${API_BASE_URL}/admin/verifyieee/${ticketId}`,
  BULK_VERIFY_IEEE_SSE: `${API_BASE_URL}/admin/bulk-verify-ieee-sse`,
  UNVERIFIED_IEEE: `${API_BASE_URL}/admin/unverified-ieee`,
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