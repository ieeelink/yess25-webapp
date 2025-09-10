import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const usePaginatedTickets = (initialPage = 1, initialLimit = 50) => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
    limit: initialLimit,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null
  });
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    paidCount: 0,
    pendingCount: 0,
    failedCount: 0,
    ieeeMembers: 0,
    nonIeeeMembers: 0,
    gsmMembers: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'timestamp',
    sortOrder: 'desc',
    isIEEEMember: '',
    ieeeVerified: '',
    institution: ''
  });

  const fetchTickets = useCallback(async (page = 1, newFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const finalFilters = { ...filters, ...newFilters };
      
      const params = {
        page,
        limit: pagination.limit,
        ...finalFilters
      };

      // Remove empty/default values to match your current API expectations
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      // Use your existing API endpoint but add pagination params
      const response = await axios.get(API_ENDPOINTS.ADMIN_DATA, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      });

      // Handle both paginated and non-paginated responses
      if (response.data.data && response.data.data.tickets) {
        // Paginated response
        setTickets(response.data.data.tickets);
        setPagination(response.data.data.pagination);
        setSummary(response.data.data.summary || {
          totalRevenue: 0,
          paidCount: 0,
          pendingCount: 0,
          failedCount: 0,
          ieeeMembers: 0,
          nonIeeeMembers: 0,
          gsmMembers: 0
        });
      } else {
        // Non-paginated response (current format)
        const allTickets = Array.isArray(response.data) ? response.data : [];
        
        // Apply client-side pagination for backward compatibility
        const startIndex = (page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedTickets = allTickets.slice(startIndex, endIndex);
        
        setTickets(paginatedTickets);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(allTickets.length / pagination.limit),
          totalTickets: allTickets.length,
          limit: pagination.limit,
          hasNextPage: endIndex < allTickets.length,
          hasPrevPage: page > 1,
          nextPage: endIndex < allTickets.length ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null
        });

        // Calculate summary from all tickets
        const summary = allTickets.reduce((acc, ticket) => {
          if (ticket.status === 'paid') {
            acc.totalRevenue += ticket.amount || 0;
            acc.paidCount++;
          } else if (ticket.status === 'pending') {
            acc.pendingCount++;
          } else {
            acc.failedCount++;
          }

          if (ticket.isIEEEMember === 'yes') {
            acc.ieeeMembers++;
          } else if (ticket.isIEEEMember === 'gsm') {
            acc.gsmMembers++;
          } else {
            acc.nonIeeeMembers++;
          }

          return acc;
        }, {
          totalRevenue: 0,
          paidCount: 0,
          pendingCount: 0,
          failedCount: 0,
          ieeeMembers: 0,
          nonIeeeMembers: 0,
          gsmMembers: 0
        });

        setSummary(summary);
      }
        
      // Update filters state
      if (Object.keys(newFilters).length > 0) {
        setFilters(prev => ({ ...prev, ...newFilters }));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tickets';
      setError(errorMessage);
      console.error('Error fetching tickets:', err);
      
      // Handle auth errors
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchTickets(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(pagination.totalPages);

  const nextPage = () => {
    if (pagination.hasNextPage) {
      fetchTickets(pagination.nextPage);
    }
  };

  const prevPage = () => {
    if (pagination.hasPrevPage) {
      fetchTickets(pagination.prevPage);
    }
  };

  const updateFilters = (newFilters) => {
    fetchTickets(1, newFilters); // Reset to page 1 when filters change
  };

  const setLimit = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit }));
    fetchTickets(1, { ...filters, limit: newLimit }); // Reset to page 1 when limit changes
  };

  const refreshTickets = () => {
    fetchTickets(pagination.currentPage, filters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      status: '',
      search: '',
      sortBy: 'timestamp',
      sortOrder: 'desc',
      isIEEEMember: '',
      ieeeVerified: '',
      institution: ''
    };
    updateFilters(defaultFilters);
  };

  // Debounced search
  const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);
  
  const debouncedSearch = (searchTerm) => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    setSearchDebounceTimer(setTimeout(() => {
      updateFilters({ ...filters, search: searchTerm });
    }, 500)); // Wait 500ms after user stops typing
  };

  return {
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
    setTickets // Export setTickets for external updates (like after editing)
  };
};

export default usePaginatedTickets;
