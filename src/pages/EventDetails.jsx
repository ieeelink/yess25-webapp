import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit3, FiTrash2, FiCalendar, FiImage } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function EventDetails() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
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
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_ENDPOINTS.EVENTS, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data)
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    setDeletingId(eventId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.DELETE_EVENT(eventId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfirmDeleteId(null);
      setSuccess('Event deleted successfully!');
      
      // Refresh events
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(API_ENDPOINTS.EVENTS, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to delete event.');
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

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
          <h1 className="text-2xl font-bold text-white font-nunito">Event Management</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/add-event')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-nunito"
            >
              <FiPlus className="text-lg" />
              Add Event
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
              <FiCalendar className="text-2xl text-blue-700" />
              <h2 className="text-xl font-semibold text-white font-nunito">Events Overview</h2>
            </div>
            <div className="text-sm text-gray-400 font-nunito">
              {events.length} event{events.length !== 1 ? 's' : ''} total
            </div>
          </div>

          {/* Events Content */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-700 border-t-transparent"></div>
              <span className="ml-3 text-gray-300 font-nunito">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <FiCalendar className="mx-auto text-6xl text-gray-500 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2 font-nunito">No Events Found</h3>
              <p className="text-gray-500 mb-6 font-nunito">Get started by creating your first event</p>
              <button
                onClick={() => navigate('/admin/add-event')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-nunito"
              >
                <FiPlus className="text-lg" />
                Create First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map(event => (
                <div key={event.id || event._id} className="bg-[#232326] rounded-lg border border-gray-600 overflow-hidden hover:border-gray-500 transition-colors">
                  <div className="aspect-video bg-gray-700 relative">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiImage className="text-4xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 font-nunito line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 font-nunito line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      {confirmDeleteId === (event.id || event._id) ? (
                        <>
                          <button
                            onClick={() => handleDeleteEvent(event.id || event._id)}
                            disabled={deletingId === (event.id || event._id)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-nunito"
                          >
                            {deletingId === (event.id || event._id) ? 'Deleting...' : 'Confirm Delete'}
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
                            onClick={() => navigate(`/admin/update-event/${event.id || event._id}`)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-nunito"
                          >
                            <FiEdit3 className="text-sm" />
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(event.id || event._id)}
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

export default EventDetails; 