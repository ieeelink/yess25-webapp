import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiArrowLeft, FiDownload, FiRefreshCw, FiDatabase, FiUsers, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

function ExportTickets() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState({ all: false, unverified: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      const response = await axios.get(API_ENDPOINTS.ADMIN_ALL_TICKETS, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch data from server');
      }
    } catch (err) {
      console.error('Export data fetch error:', err);
      
      let errorMessage = 'Failed to fetch export data';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (err.response.status === 403) {
          errorMessage = 'Not authorized to access export data';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.response.data?.message || `Server error (${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportAllData = async () => {
    if (!data || !data.tickets) return;
    
    setExporting(prev => ({ ...prev, all: true }));
    
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `yess25_all_tickets_${currentDate}.json`;
      
      downloadJSON(data.tickets, filename);
      
      // Show success message briefly
      setTimeout(() => {
        setExporting(prev => ({ ...prev, all: false }));
      }, 1000);
    } catch (err) {
      console.error('Export error:', err);
      setExporting(prev => ({ ...prev, all: false }));
    }
  };

  const handleExportUnverifiedIEEE = async () => {
    if (!data || !data.tickets) return;
    
    setExporting(prev => ({ ...prev, unverified: true }));
    
    try {
      // Filter for unverified IEEE members
      const unverifiedIEEETickets = data.tickets.filter(ticket => 
        (ticket.isIEEEMember === 'yes' || ticket.isIEEEMember === 'gsm') &&
        (ticket.ieeeVerified === false || ticket.ieeeVerified === null || ticket.ieeeVerified === undefined) &&
        (ticket.ieeeVerificationCompleted === false || ticket.ieeeVerificationCompleted === null || ticket.ieeeVerificationCompleted === undefined)
      );
      
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `yess25_unverified_ieee_${currentDate}.json`;
      
      downloadJSON(unverifiedIEEETickets, filename);
      
      // Show success message briefly
      setTimeout(() => {
        setExporting(prev => ({ ...prev, unverified: false }));
      }, 1000);
    } catch (err) {
      console.error('Export error:', err);
      setExporting(prev => ({ ...prev, unverified: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181b]">
        {/* Header */}
        <div className="bg-[#1a1a1a] shadow-md border-b border-gray-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/ticket-details')}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FiArrowLeft className="text-xl" />
                <span className="font-medium">Back to Ticket Details</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-white">Export Tickets</h1>
            <div className="w-48"></div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-12 w-12 text-[#fe4a56] mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-xl font-semibold mb-2 text-white">Loading Export Data</h2>
                <p className="text-gray-400">Fetching all ticket information...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#18181b]">
        {/* Header */}
        <div className="bg-[#1a1a1a] shadow-md border-b border-gray-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/ticket-details')}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FiArrowLeft className="text-xl" />
                <span className="font-medium">Back to Ticket Details</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-white">Export Tickets</h1>
            <div className="w-48"></div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold mb-2 text-red-400">Error Loading Data</h2>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={fetchAllData}
                  className="bg-[#fe4a56] text-white px-6 py-2 rounded-lg hover:bg-[#8c0505] transition-colors flex items-center gap-2 mx-auto"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const unverifiedIEEECount = data?.tickets ? data.tickets.filter(ticket => 
    (ticket.isIEEEMember === 'yes' || ticket.isIEEEMember === 'gsm') &&
    (ticket.ieeeVerified === false || ticket.ieeeVerified === null || ticket.ieeeVerified === undefined) &&
    (ticket.ieeeVerificationCompleted === false || ticket.ieeeVerificationCompleted === null || ticket.ieeeVerificationCompleted === undefined)
  ).length : 0;

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
              onClick={() => navigate('/admin/ticket-details')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-medium">Back to Ticket Details</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white">Export Tickets</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
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

          {/* Summary Statistics Section */}
          {data?.summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Tickets</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(data.summary.totalTickets)}</p>
                  </div>
                  <FiDatabase className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Paid Tickets</p>
                    <p className="text-2xl font-bold text-green-400">{formatNumber(data.summary.paidTickets)}</p>
                  </div>
                  <FiUsers className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-yellow-400">{formatCurrency(data.summary.totalRevenue)}</p>
                  </div>
                  <FiDollarSign className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">IEEE Verified</p>
                    <p className="text-2xl font-bold text-purple-400">{formatNumber(data.summary.ieeeVerifiedCount)}</p>
                  </div>
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Two Column Layout for Analytics and Export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Analytics */}
            <div className="space-y-6">
              {/* Detailed Analytics */}
              {data?.analytics && (
                <div className="space-y-6">
                  {/* Institution Stats */}
                  <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-white">Top Institutions</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                      {Object.entries(data.analytics.institutionStats)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 10)
                        .map(([institution, count]) => (
                          <div key={institution} className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm truncate mr-2">{institution}</span>
                            <span className="text-white font-semibold">{formatNumber(count)}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Food Preference Stats */}
                  <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-white">Food Preferences</h3>
                    <div className="space-y-3">
                      {Object.entries(data.analytics.foodPreferenceStats).map(([preference, count]) => (
                        <div key={preference} className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">{preference}</span>
                          <span className="text-white font-semibold">{formatNumber(count)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gender Stats */}
                  <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-white">Gender Distribution</h3>
                    <div className="space-y-3">
                      {Object.entries(data.analytics.genderStats).map(([gender, count]) => (
                        <div key={gender} className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm capitalize">{gender}</span>
                          <span className="text-white font-semibold">{formatNumber(count)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - IEEE Membership and Export */}
            <div className="space-y-6">
              {/* IEEE Membership Breakdown */}
              {data?.summary && (
                <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-white">IEEE Membership Breakdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{formatNumber(data.summary.ieeeMembers)}</p>
                      <p className="text-gray-400 text-sm">IEEE Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{formatNumber(data.summary.gsmMembers)}</p>
                      <p className="text-gray-400 text-sm">GSM Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">{formatNumber(data.summary.nonIeeeMembers)}</p>
                      <p className="text-gray-400 text-sm">Non-IEEE Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">{formatNumber(unverifiedIEEECount)}</p>
                      <p className="text-gray-400 text-sm">Unverified IEEE</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Actions */}
              <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-6 text-white">Export Options</h3>
                
                <div className="space-y-4">
                  {/* Export All Data */}
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Export All Ticket Data</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Download complete ticket database with all {formatNumber(data?.tickets?.length || 0)} records in JSON format.
                    </p>
                    <button
                      onClick={handleExportAllData}
                      disabled={exporting.all || !data?.tickets}
                      className="w-full bg-[#fe4a56] text-white px-4 py-3 rounded-lg hover:bg-[#8c0505] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <FiDownload className="w-4 h-4" />
                      {exporting.all ? 'Exporting...' : 'Export All Data'}
                    </button>
                  </div>

                  {/* Export Unverified IEEE */}
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Export Unverified IEEE Members</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Download {formatNumber(unverifiedIEEECount)} unverified IEEE/GSM member records for verification processing.
                    </p>
                    <button
                      onClick={handleExportUnverifiedIEEE}
                      disabled={exporting.unverified || !data?.tickets || unverifiedIEEECount === 0}
                      className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <FiDownload className="w-4 h-4" />
                      {exporting.unverified ? 'Exporting...' : 'Export Unverified IEEE'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {data?.metadata && (
                <div className="bg-[#232326] rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-white">Data Information</h3>
                  <div className="text-gray-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        Retrieved:
                      </span>
                      <span className="text-sm">{new Date(data.metadata.retrievedAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FiDatabase className="w-4 h-4" />
                        Records:
                      </span>
                      <span className="text-sm">{formatNumber(data.metadata.totalRecords)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportTickets;
