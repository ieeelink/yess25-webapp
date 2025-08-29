import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiArrowLeft, FiDownload, FiFileText, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

function GenerateTickets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [excludedTickets, setExcludedTickets] = useState(new Set());
  const [generationOptions, setGenerationOptions] = useState({
    format: 'pdf',
    includeQRCode: true,
    includeDetails: true
  });
  const navigate = useNavigate();

  // Fetch tickets from the verified-no-ticket endpoint
  useEffect(() => {
    const fetchVerifiedTickets = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_ENDPOINTS.API_BASE}/admin/verified-no-ticket`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTickets(response.data);
        // No need to set selectedTickets since selection is based on exclusion
      } catch (err) {
        console.error('Failed to fetch verified tickets:', err);
        setError('Failed to fetch verified tickets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedTickets();
  }, []);

  // Handle ticket selection - now just toggles based on exclusion
  const handleTicketToggle = (ticketId) => {
    // This function is no longer needed since we're removing checkboxes
    // Selection is now based on what's not excluded
  };

  // Handle select all/none - now manages exclusion
  const handleSelectAll = () => {
    if (excludedTickets.size === 0) {
      // If nothing is excluded, exclude all (deselect all)
      setExcludedTickets(new Set(tickets.map(ticket => ticket._id)));
    } else {
      // If some are excluded, include all (select all)
      setExcludedTickets(new Set());
    }
  };

  // Handle ticket removal from generation
  const handleRemoveTicket = (ticketId) => {
    const newExcluded = new Set(excludedTickets);
    newExcluded.add(ticketId);
    setExcludedTickets(newExcluded);
  };

  // Handle ticket restoration
  const handleRestoreTicket = (ticketId) => {
    const newExcluded = new Set(excludedTickets);
    newExcluded.delete(ticketId);
    setExcludedTickets(newExcluded);
  };

  const handleGenerateTickets = async () => {
    const selectedTicketIds = tickets
      .filter(ticket => !excludedTickets.has(ticket._id))
      .map(ticket => ticket._id);

    if (selectedTicketIds.length === 0) {
      setError('Please select at least one ticket to generate.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required.');
        setLoading(false);
        return;
      }

      const payload = {
        ticketIds: selectedTicketIds,
        ...generationOptions
      };

      const response = await axios.post(
        `${API_ENDPOINTS.API_BASE}/admin/generate-tickets`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename based on format
      const filename = `yess25-tickets-${new Date().toISOString().split('T')[0]}.${generationOptions.format}`;
      link.setAttribute('download', filename);
      
      // Start download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`${selectedTicketIds.length} tickets generated and downloaded successfully!`);
    } catch (err) {
      console.error('Ticket generation error:', err);
      setError(
        err.response?.data?.message || 'Failed to generate tickets. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on exclusion
  const availableTickets = tickets.filter(ticket => !excludedTickets.has(ticket._id));
  const excludedTicketsList = tickets.filter(ticket => excludedTickets.has(ticket._id));
  const selectedCount = availableTickets.length; // All available tickets are considered selected

  return (
    <div className="min-h-screen bg-[#18181b]">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.6);
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}} />
      
      {/* Header */}
      <div className="bg-[#1a1a1a] shadow-md border-b border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/tickets')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-medium">Back to Ticket Details</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white">Generate Tickets</h1>
          <div className="w-48"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Status Messages */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/20 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Available Tickets */}
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Available Tickets ({availableTickets.length})</h2>
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  {excludedTickets.size === 0 ? <FiX className="w-4 h-4" /> : <FiCheck className="w-4 h-4" />}
                  {excludedTickets.size === 0 ? 'Exclude All' : 'Include All'}
                </button>
              </div>

              {/* Statistics */}
              <div className="mb-6 p-4 bg-[#2a2a2c] rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Statistics:</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Total Verified Tickets: {tickets.length}</div>
                  <div>Selected for Generation: {selectedCount}</div>
                  <div>Excluded from Generation: {excludedTickets.size}</div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="mb-6">
                <button
                  onClick={handleGenerateTickets}
                  disabled={loading || selectedCount === 0}
                  className="w-full flex items-center justify-center gap-2 bg-[#fe4a56] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8c0505] transition-colors shadow border border-[#fe4a56] hover:border-[#8c0505] focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiDownload className="w-5 h-5" />
                  {loading ? 'Generating...' : `Generate ${selectedCount} PDF Tickets`}
                </button>
              </div>
              
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading tickets...</div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
                  {availableTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="p-4 rounded-lg border bg-[#2a2a2c] border-gray-600 hover:border-gray-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-white">{ticket.fullName}</div>
                          <div className="text-sm text-gray-400">{ticket.email}</div>
                          <div className="text-xs text-gray-500">{ticket.institution} • {ticket.yessTicketId}</div>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleRemoveTicket(ticket._id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Remove from generation"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {availableTickets.length === 0 && !loading && (
                    <div className="text-center text-gray-400 py-8">
                      No verified tickets available for generation.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Excluded Tickets */}
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Excluded Tickets ({excludedTicketsList.length})</h2>
              
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                {excludedTicketsList.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="p-4 rounded-lg border bg-red-900/20 border-red-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-white">{ticket.fullName}</div>
                        <div className="text-sm text-gray-400">{ticket.email}</div>
                        <div className="text-xs text-gray-500">{ticket.institution} • {ticket.yessTicketId}</div>
                      </div>
                      <button
                        onClick={() => handleRestoreTicket(ticket._id)}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        title="Restore to generation list"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {excludedTicketsList.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No tickets excluded from generation.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateTickets;
