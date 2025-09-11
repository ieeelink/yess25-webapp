import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLock, FiLogOut, FiUser, FiChevronDown, FiCalendar, FiBell, FiMail, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import UpdateTicketForm from '../components/UpdateTicketForm';
import Pagination from '../components/Pagination';
import TicketSummary from '../components/TicketSummary';
import usePaginatedTickets from '../hooks/usePaginatedTickets';
import { API_ENDPOINTS } from '../config/api';

function TicketDetails() {
  // Use the paginated tickets hook
  const {
    tickets,
    pagination,
    summary,
    loading,
    error,
    filters,
    fetchTickets,
    goToPage,
    goToFirstPage,
    goToLastPage,
    nextPage,
    prevPage,
    updateFilters,
    setLimit,
    refreshTickets,
    clearFilters,
    debouncedSearch,
    setTickets
  } = usePaginatedTickets(1, 50);

  // Keep existing state for UI components
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRegistrationsDropdown, setShowRegistrationsDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyNewPassword, setVerifyNewPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [editingTicket, setEditingTicket] = useState(null); // ticket being edited
  const [sendingEmail, setSendingEmail] = useState({}); // track email sending status per ticket
  const [emailStatus, setEmailStatus] = useState({}); // track email success/error messages
  const navigate = useNavigate();

  // Local filter states for UI components (synced with pagination hook)
  const [search, setSearch] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [ieeeFilter, setIeeeFilter] = useState(filters.isIEEEMember);
  const [ieeeVerifiedFilter, setIeeeVerifiedFilter] = useState(filters.ieeeVerified);

  // Check if local filters differ from applied filters
  const hasUnappliedFilters = () => {
    return search !== filters.search ||
           statusFilter !== filters.status ||
           ieeeFilter !== filters.isIEEEMember ||
           ieeeVerifiedFilter !== filters.ieeeVerified;
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Sync local filters with pagination hook
  useEffect(() => {
    setSearch(filters.search);
    setStatusFilter(filters.status);
    setInstitutionFilter(''); // Keep for UI state but don't sync from API
    setIeeeFilter(filters.isIEEEMember);
    setIeeeVerifiedFilter(filters.ieeeVerified);
  }, [filters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
      if (showRegistrationsDropdown && !event.target.closest('.registrations-dropdown')) {
        setShowRegistrationsDropdown(false);
      }
      if (showMobileMenu && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-btn')) {
        setShowMobileMenu(false);
      }
      if (showMobileFilters && !event.target.closest('.mobile-filters') && !event.target.closest('.filter-btn')) {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, showRegistrationsDropdown, showMobileMenu, showMobileFilters]);

  const handleEdit = (ticketId) => {
    const ticket = tickets.find(t => t._id === ticketId);
    setEditingTicket(ticket);
  };

  // Handle filter changes - now only update local state
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
  };

  const handleIeeeChange = (e) => {
    const value = e.target.value;
    setIeeeFilter(value);
  };

  const handleIeeeVerifiedChange = (e) => {
    const value = e.target.value;
    setIeeeVerifiedFilter(value);
  };

  // Apply filters when user clicks the Filter button
  const handleApplyFilters = () => {
    updateFilters({
      search: search,
      status: statusFilter,
      isIEEEMember: ieeeFilter,
      ieeeVerified: ieeeVerifiedFilter
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setInstitutionFilter(''); // Clear local state only
    setIeeeFilter('');
    setIeeeVerifiedFilter('');
    clearFilters();
  };

  const handleSendInvoiceEmail = async (ticketId) => {
    setSendingEmail(prev => ({ ...prev, [ticketId]: true }));
    setEmailStatus(prev => ({ ...prev, [ticketId]: null }));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setEmailStatus(prev => ({ ...prev, [ticketId]: { type: 'error', message: 'Authentication required' } }));
        return;
      }

      const response = await axios.post(
        API_ENDPOINTS.ADMIN_GENERATE_INVOICE(ticketId),
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Check if the response indicates success
      if (response.status === 200 || response.status === 201) {
        setEmailStatus(prev => ({ 
          ...prev, 
          [ticketId]: { 
            type: 'success', 
            message: response.data?.message || 'Invoice generated and email sent successfully!' 
          } 
        }));
      } else {
        // Handle unexpected success status codes
        setEmailStatus(prev => ({ 
          ...prev, 
          [ticketId]: { 
            type: 'error', 
            message: response.data?.message || 'Unexpected response from server' 
          } 
        }));
      }

      // Clear success message after 4 seconds
      setTimeout(() => {
        setEmailStatus(prev => ({ ...prev, [ticketId]: null }));
      }, 4000);

    } catch (err) {
      console.error('Invoice generation error:', err);
      
      // Handle different types of errors
      let errorMessage = 'Failed to generate and send invoice';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (err.response.status === 403) {
          errorMessage = 'Not authorized to generate invoices';
        } else if (err.response.status === 404) {
          errorMessage = 'Ticket not found';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.response.data?.message || `Server error (${err.response.status})`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        errorMessage = err.message || 'An unexpected error occurred';
      }

      setEmailStatus(prev => ({ 
        ...prev, 
        [ticketId]: { 
          type: 'error', 
          message: errorMessage
        } 
      }));

      // Clear error message after 6 seconds
      setTimeout(() => {
        setEmailStatus(prev => ({ ...prev, [ticketId]: null }));
      }, 6000);
    } finally {
      setSendingEmail(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    window.location.reload(); // or redirect to login page
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  // Get unique institutions for dropdown
  const institutions = Array.from(new Set(tickets.map(t => t.institution).filter(Boolean)));
  const statuses = Array.from(new Set(tickets.map(t => t.status).filter(Boolean)));

  // Remove client-side filtering since it's now handled by the pagination hook
  const filteredTickets = tickets;

  if (loading) {
    return (
      <div className="text-white text-center text-2xl h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-[#fe4a56] mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading tickets...
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-2xl h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#18181b]">
      {/* Custom Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-gray-800 shadow z-20">
        <div className="flex items-center gap-2">
          <img src="/yess_icon.png" alt="YESS Logo" className="h-10 w-10" />
          <span className="text-white text-xl font-bold tracking-wide">YESS'25 Admin Dashboard</span>
        </div>
        
        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Registrations Dropdown */}
          <div className="relative registrations-dropdown">
            <button
              onClick={() => setShowRegistrationsDropdown(!showRegistrationsDropdown)}
              className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-green-700/20 px-3 py-2 rounded-lg font-medium transition-colors border border-transparent hover:border-green-700/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
              </svg>
              Registrations
              <FiChevronDown className={`w-4 h-4 transition-transform ${showRegistrationsDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Registrations Dropdown Menu */}
            {showRegistrationsDropdown && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-[#232326] border border-gray-700 rounded-lg shadow-lg py-1 z-30">
                <a
                  onClick={() => {
                    navigate('/admin/add-ticket');
                    setShowRegistrationsDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-green-700/20 transition-colors cursor-pointer"
                >
                  + Add Ticket
                </a>
                <a
                  onClick={() => {
                    navigate('/admin/add-bulk-tickets');
                    setShowRegistrationsDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-green-700/20 transition-colors cursor-pointer"
                >
                  + Bulk Tickets
                </a>
                <a
                  onClick={() => {
                    navigate('/admin/webhook-resolve');
                    setShowRegistrationsDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-yellow-700/20 transition-colors cursor-pointer"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Webhook Resolver
                </a>
              </div>
            )}
          </div>
          
          <a
            onClick={() => navigate('/admin/event-details')}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-blue-700/20 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer border border-transparent hover:border-blue-700/50"
          >
            <FiCalendar className="w-4 h-4" />
            Event Details
          </a>
          <a
            onClick={() => navigate('/admin/updates')}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-purple-700/20 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer border border-transparent hover:border-purple-700/50"
          >
            <FiBell className="w-4 h-4" />
            Updates
          </a>
          <a
            onClick={() => navigate('/admin/bulk-ieee-verification')}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-orange-700/20 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer border border-transparent hover:border-orange-700/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            IEEE Verify
          </a>
          <a
            onClick={() => navigate('/admin/generate-tickets')}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-indigo-700/20 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer border border-transparent hover:border-indigo-700/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
            </svg>
            Generate Tickets
          </a>
          
          {/* User Dropdown */}
          <div className="relative ml-4 pl-4 border-l border-gray-700 user-dropdown">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700/20 px-3 py-2 rounded-lg font-medium transition-colors border border-transparent hover:border-gray-700/50"
            >
              <FiUser className="w-4 h-4" />
              <FiChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#232326] border border-gray-700 rounded-lg shadow-lg py-1 z-30">
                <a
                  onClick={() => {
                    navigate('/admin/add');
                    setShowUserDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-green-700/20 transition-colors cursor-pointer"
                >
                  + Add User
                </a>
                <a
                  onClick={() => {
                    handleChangePassword();
                    setShowUserDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-red-700/20 transition-colors cursor-pointer"
                >
                  <FiLock className="w-4 h-4" />
                  Change Password
                </a>
                <a
                  onClick={() => {
                    handleLogout();
                    setShowUserDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-red-700/20 transition-colors cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Icons */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Filter Icon */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="filter-btn p-2 text-gray-300 hover:text-white hover:bg-gray-700/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="hamburger-btn p-2 text-gray-300 hover:text-white hover:bg-gray-700/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}></div>
          <div className="mobile-menu fixed right-0 top-0 h-full w-72 bg-[#1a1a1a] border-l border-gray-800 shadow-xl">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Menu</span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/20 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {/* Registrations Section */}
              <div className="space-y-1">
                <div className="text-sm text-gray-400 font-medium px-2 mb-2">Registrations</div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/admin/add-ticket');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-green-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  Add Ticket
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/admin/add-bulk-tickets');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-green-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                  </svg>
                  Bulk Tickets
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/admin/webhook-resolve');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-yellow-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 text-left"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Webhook Resolver
                </button>
              </div>

              {/* Main Navigation */}
              <div className="space-y-1 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/admin/event-details');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-blue-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                >
                  <FiCalendar className="w-4 h-4" />
                  Event Details
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/admin/updates');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 text-left"
                >
                  <FiBell className="w-4 h-4" />
                  Updates
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/admin/bulk-ieee-verification');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-orange-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  IEEE Verify
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/admin/generate-tickets');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-indigo-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                  </svg>
                  Generate Tickets
                </button>
              </div>

              {/* User Actions */}
              <div className="space-y-1 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 font-medium px-2 mb-2">Account</div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/admin/add');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-green-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 text-left"
                >
                  <FiUser className="w-4 h-4" />
                  Add User
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChangePassword();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-red-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 text-left"
                >
                  <FiLock className="w-4 h-4" />
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-red-700/20 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 text-left"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
          <div className="mobile-filters fixed left-0 top-0 h-full w-80 bg-[#1a1a1a] border-r border-gray-800 shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Filters</span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/20 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, email, ticket ID, phone, or institution..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="attempted">Attempted</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* IEEE Member Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">IEEE Membership</label>
                <select
                  value={ieeeFilter}
                  onChange={(e) => setIeeeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Members</option>
                  <option value="true">IEEE Members</option>
                  <option value="false">Non-IEEE Members</option>
                </select>
              </div>

              {/* IEEE Verified Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">IEEE Verification</label>
                <select
                  value={ieeeVerifiedFilter}
                  onChange={(e) => setIeeeVerifiedFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>

              {/* Apply/Reset Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    handleApplyFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#fe4a56] hover:bg-[#8c0505] text-white rounded-lg font-medium transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="absolute top-20 right-10 bg-[#232326] border border-gray-700 rounded-lg shadow-lg p-6 z-30 w-80 flex flex-col gap-3">
          <h2 className="text-lg font-bold text-white mb-2">Change Password</h2>
          {changePasswordError && <div className="text-red-500 text-sm mb-2">{changePasswordError}</div>}
          {changePasswordSuccess && <div className="text-green-500 text-sm mb-2">{changePasswordSuccess}</div>}
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
          />
          <input
            type="password"
            placeholder="Verify New Password"
            value={verifyNewPassword}
            onChange={e => setVerifyNewPassword(e.target.value)}
            className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { setShowChangePassword(false); setChangePasswordError(''); setChangePasswordSuccess(''); }}
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setChangePasswordError('');
                setChangePasswordSuccess('');
                if (newPassword !== verifyNewPassword) {
                  setChangePasswordError('New passwords do not match.');
                  return;
                }
                if (!currentPassword || !newPassword) {
                  setChangePasswordError('Please fill all fields.');
                  return;
                }
                try {
                  const username = localStorage.getItem('admin');
                  const token = localStorage.getItem('token');
                  const response = await axios.post(API_ENDPOINTS.ADMIN_CHANGE_PASSWORD, {
                    username,
                    currentPassword,
                    newPassword
                  }, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setChangePasswordSuccess('Password changed successfully!');
                  setCurrentPassword('');
                  setNewPassword('');
                  setVerifyNewPassword('');
                  setTimeout(() => {
                    setShowChangePassword(false);
                    setChangePasswordSuccess('');
                  }, 1500);
                } catch (err) {
                  setChangePasswordError(
                    err.response?.data?.message || 'Failed to change password. Please try again.'
                  );
                }
              }}
              className="px-4 py-2 rounded bg-[#fe4a56] text-white hover:bg-[#8c0505] text-sm font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {/* Desktop Filters Section - Hidden on Mobile */}
      <div className="hidden lg:block w-full px-6 py-4 bg-[#232326] border-b border-gray-800 z-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Filter Controls */}
          <div className="flex items-center gap-3 flex-wrap min-w-0 flex-1">
            <input
              type="text"
              placeholder="Search by name, email, ticket ID, phone, or institution..."
              value={search}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] w-80 text-sm"
            />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] text-sm min-w-0"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="attempted">Attempted</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={ieeeFilter}
              onChange={handleIeeeChange}
              className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] text-sm min-w-0"
            >
              <option value="">All IEEE</option>
              <option value="yes">IEEE Member</option>
              <option value="no">Non-IEEE</option>
              <option value="gsm">GSM</option>
            </select>
            <select
              value={ieeeVerifiedFilter}
              onChange={handleIeeeVerifiedChange}
              className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] text-sm min-w-0"
            >
              <option value="">All Verified</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className={`px-3 py-2 rounded border text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                hasUnappliedFilters() 
                  ? 'bg-green-600 text-white hover:bg-green-700 border-green-600 hover:border-green-700 shadow-md' 
                  : 'bg-green-600/50 text-green-200 border-green-600/50 cursor-default'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              {loading ? 'Filtering...' : hasUnappliedFilters() ? 'Apply' : 'Applied'}
              {hasUnappliedFilters() && (
                <span className="inline-flex items-center justify-center w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              )}
            </button>
            
            <button
              onClick={handleResetFilters}
              className="bg-gray-700 text-gray-200 px-3 py-2 rounded hover:bg-gray-600 border border-gray-600 text-sm font-semibold"
            >
              Reset
            </button>
            
            <button
              onClick={refreshTickets}
              disabled={loading}
              className="bg-[#fe4a56] text-white px-3 py-2 rounded hover:bg-[#8c0505] border border-[#fe4a56] hover:border-[#8c0505] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm font-semibold"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {/* Results Counter */}
          <div className="text-gray-300 text-xs font-semibold whitespace-nowrap flex-shrink-0">
            {pagination.totalTickets.toLocaleString()} result{pagination.totalTickets !== 1 ? 's' : ''} 
            {pagination.totalPages > 1 && (
              <span className="ml-1 text-gray-400">
                (Page {pagination.currentPage}/{pagination.totalPages})
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Summary Statistics Section - Responsive */}
      <div className="w-full px-4 lg:px-6 py-3 bg-[#18181b] border-b border-gray-800">
        <TicketSummary summary={summary} loading={loading} />
      </div>
      
      <div className="w-full" style={{ height: 'calc(100vh - 72px - 64px - 48px)' }}>
        {/* Show UpdateTicketForm modal if editingTicket is set */}
        {editingTicket && (
          <UpdateTicketForm
            ticket={editingTicket}
            onClose={() => setEditingTicket(null)}
            onSave={updatedTicket => {
              // Update the tickets list with the edited ticket
              setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
              setEditingTicket(null);
              // Optionally refresh to get the latest data
              refreshTickets();
            }}
          />
        )}
        <div
          className="flex flex-col items-center text-white p-2 lg:p-4 pb-30 overflow-y-auto w-full h-full \
            [&::-webkit-scrollbar]:w-2 \
            [&::-webkit-scrollbar-track]:bg-transparent \
            [&::-webkit-scrollbar-thumb]:bg-[#fe4a56]/60 \
            [&::-webkit-scrollbar-thumb]:rounded-full \
            hover:[&::-webkit-scrollbar-thumb]:bg-[#fe4a56]/90"
        >
          <h1 className="text-3xl font-bold mb-8 nunito-sans-body">Ticket Details</h1>
          <div className="w-full max-w-6xl space-y-8 pb-8">
            {filteredTickets.map((ticket) => (
              <div key={ticket._id} className="bg-[#232326] rounded-xl shadow p-6 flex flex-col relative overflow-x-auto border border-gray-800 nunito-sans-body">
                {/* Status badge */}
                <span className={`absolute top-4 right-6 px-4 py-1 rounded-full text-xs font-semibold nunito-sans-body ${
                  ticket.status === 'paid' ? 'bg-green-900/80 text-green-200' : 
                  ticket.status === 'attempted' ? 'bg-orange-900/80 text-orange-200' : 
                  'bg-yellow-900/80 text-yellow-200'
                }`}>
                  {ticket.status === 'paid' ? 'Paid' : 
                   ticket.status === 'attempted' ? 'Attempted' : 
                   ticket.status}
                </span>
                {/* Details (no image, no documents) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0 nunito-sans-body">
                  {/* Personal Info & Preferences */}
                  <div className="min-w-0 break-words nunito-sans-body">
                    <h2 className="text-xl font-bold mb-2 text-gray-100 truncate nunito-sans-body">{ticket.fullName}</h2>
                    <div className="text-gray-400 text-sm mb-1 nunito-sans-body">Contact Information</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">{ticket.email}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">{ticket.phone}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Gender: {ticket.gender}</div>
                    <div className="text-gray-400 text-sm mb-1 mt-4 nunito-sans-body">Preferences</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Food: {ticket.foodPreference}</div>
                  </div>
                  {/* Educational Details */}
                  <div className="min-w-0 break-words nunito-sans-body">
                    <div className="text-gray-400 text-sm mb-1 nunito-sans-body">Educational Details</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Institution: {ticket.institution}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Course: {ticket.course}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Year: {ticket.yearOfStudy}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">IEEE Member: {ticket.isIEEEMember}</div>
                    {ticket.ieeeMembershipNumber && (
                      <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">IEEE No: {ticket.ieeeMembershipNumber}</div>
                    )}
                    <div className="mb-2 text-sm flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full font-semibold text-xs inline-block whitespace-nowrap w-fit ${ticket.ieeeVerificationCompleted === true ? 'bg-green-900/80 text-green-200' : 'bg-yellow-900/80 text-yellow-200'}`}>
                        Verification Completed: {ticket.ieeeVerificationCompleted === true ? 'Yes' : 'No'}
                      </span>
                      <span className={`px-2 py-1 rounded-full font-semibold text-xs inline-block whitespace-nowrap w-fit ${ticket.ieeeVerified === true ? 'bg-green-900/80 text-green-200' : 'bg-red-900/80 text-red-200'}`}>
                        Verified: {ticket.ieeeVerified === true ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  {/* Payment Details */}
                  <div className="min-w-0 break-words nunito-sans-body">
                    <div className="text-gray-400 text-sm mb-1 nunito-sans-body">Payment Details</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Amount: ₹{(ticket.amount / 100).toFixed(2)}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment Status: {ticket.paymentStatus}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment Verified: {ticket.paymentVerified ? 'Yes' : 'No'}</div>
                    {ticket.paymentId && (
                      <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment ID: {ticket.paymentId}</div>
                    )}
                  </div>
                  {/* Ticket Details */}
                  <div className="min-w-0 break-words nunito-sans-body">
                    <div className="text-gray-400 text-sm mb-1 nunito-sans-body">Ticket Details</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">YESS Ticket ID: {ticket.yessTicketId}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Registration ID: {ticket.registrationId}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Registered: {ticket.timestamp ? new Date(ticket.timestamp).toLocaleString() : ''}</div>
                    {ticket.paymentCompletedAt && (
                      <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment Completed: {new Date(ticket.paymentCompletedAt).toLocaleString()}</div>
                    )}
                    {ticket.paymentVerifiedAt && (
                      <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment Verified: {new Date(ticket.paymentVerifiedAt).toLocaleString()}</div>
                    )}
                  </div>
                </div>
                {/* Action buttons below details, aligned right */}
                <div className="flex justify-end mt-6 gap-3">
                  {/* Email status message */}
                  {emailStatus[ticket._id] && (
                    <div className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                      emailStatus[ticket._id].type === 'success' 
                        ? 'bg-green-900/20 text-green-400 border border-green-700' 
                        : 'bg-red-900/20 text-red-400 border border-red-700'
                    }`}>
                      {emailStatus[ticket._id].message}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleSendInvoiceEmail(ticket._id)}
                    disabled={sendingEmail[ticket._id]}
                    className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow border border-blue-600 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 nunito-sans-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiMail className="w-4 h-4 mr-1" />
                    {sendingEmail[ticket._id] ? 'Sending...' : 'Send Invoice'}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(ticket._id)}
                    className="flex items-center gap-1 bg-[#fe4a56] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#8c0505] transition-colors shadow border border-[#fe4a56] hover:border-[#8c0505] focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 nunito-sans-body"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z"/></svg>
                    Edit
                  </button>
                </div>
              </div>
            ))}
            
            {/* No results message */}
            {!loading && filteredTickets.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-500 mb-2">No tickets found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#fe4a56] text-white px-4 py-2 rounded-lg hover:bg-[#8c0505] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Pagination Component */}
          {!loading && filteredTickets.length > 0 && pagination.totalPages > 1 && (
            <div className="w-full max-w-6xl mt-8 mb-12">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalTickets={pagination.totalTickets}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onPageChange={goToPage}
                onNext={nextPage}
                onPrev={prevPage}
                onFirst={goToFirstPage}
                onLast={goToLastPage}
                limit={pagination.limit}
                onLimitChange={setLimit}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketDetails; 