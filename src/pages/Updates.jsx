import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit3, FiTrash2, FiCalendar, FiBell, FiImage } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function Updates() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Custom scrollbar styles
  const scrollbarStyles = `
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
    
    /* Firefox scrollbar */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.6) rgba(75, 85, 99, 0.3);
    }
  `;

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(API_ENDPOINTS.UPDATES, { headers });
        setUpdates(response.data);
      } catch (err) {
        setError('Failed to fetch updates.');
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  const handleDeleteUpdate = async (updateId) => {
    setDeletingId(updateId);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(API_ENDPOINTS.DELETE_UPDATE(updateId), { headers });
      setConfirmDeleteId(null);
      setSuccess('Update deleted successfully!');
      
      // Refresh updates
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(API_ENDPOINTS.UPDATES, { headers });
        setUpdates(response.data);
      } catch (err) {
        setError('Failed to fetch updates.');
      } finally {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to delete update.');
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to format date as dd/mm/yyyy
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return 'Invalid Date';
    }
  }

  return (
    <div className="min-h-screen bg-[#18181b]">
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      
      {/* Header */}
      <div className="bg-[#1a1a1a] shadow-md border-b border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-medium font-nunito">Back</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white font-nunito">Updates Management</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/add-update')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-nunito"
            >
              <FiPlus className="text-lg" />
              Add Update
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 font-nunito">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 font-nunito">{success}</p>
            </div>
          )}

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FiBell className="text-2xl text-purple-700" />
              <h2 className="text-xl font-semibold text-white font-nunito">Updates Overview</h2>
            </div>
            <div className="text-sm text-gray-400 font-nunito">
              {updates.length} update{updates.length !== 1 ? 's' : ''} total
            </div>
          </div>

          {/* Updates Content */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-700 border-t-transparent"></div>
              <span className="ml-3 text-gray-300 font-nunito">Loading updates...</span>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-16">
              <FiBell className="mx-auto text-6xl text-gray-500 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2 font-nunito">No Updates Found</h3>
              <p className="text-gray-500 mb-6 font-nunito">Get started by creating your first update</p>
              <button
                onClick={() => navigate('/admin/add-update')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-nunito"
              >
                <FiPlus className="text-lg" />
                Create First Update
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {updates.map(update => (
                <div key={update.id || update._id} className="bg-[#232326] rounded-lg border border-gray-600 overflow-hidden hover:border-gray-500 transition-colors">
                  <div className="aspect-video bg-gray-700 relative">
                    {update.image ? (
                      <img 
                        src={update.image} 
                        alt={update.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiImage className="text-4xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-700 rounded-full"></div>
                        <span className="text-xs text-gray-400 font-nunito">
                          {formatDate(update.date)}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 font-nunito line-clamp-2">
                      {update.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 font-nunito line-clamp-3">
                      {update.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      {confirmDeleteId === (update.id || update._id) ? (
                        <>
                          <button
                            onClick={() => handleDeleteUpdate(update.id || update._id)}
                            disabled={deletingId === (update.id || update._id)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-nunito"
                          >
                            {deletingId === (update.id || update._id) ? 'Deleting...' : 'Confirm Delete'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-nunito"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => console.log('Update', update.id || update._id)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-nunito"
                          >
                            <FiEdit3 className="text-sm" />
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(update.id || update._id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-nunito"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Updates; 