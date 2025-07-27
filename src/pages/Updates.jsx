import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function Updates() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(API_ENDPOINTS.UPDATES);
        setUpdates(response.data);
      } catch (err) {
        setError('Failed to fetch updates.');
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  // Helper to format date as dd/mm/yyyy
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#18181b] p-8">
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Updates</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/add-update')}
              className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 font-semibold border border-purple-800 shadow"
            >
              + Add Update
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm font-semibold"
            >
              Back
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-white text-center text-xl py-12">Loading updates...</div>
        ) : error ? (
          <div className="text-red-500 text-center text-xl py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {updates.length === 0 ? (
              <div className="col-span-full text-gray-400 text-center">No updates found.</div>
            ) : (
              updates.map(update => (
                <div key={update.id || update._id} className="bg-[#232326] rounded-xl shadow p-6 border border-gray-800 flex flex-col items-center">
                  <img src={update.image || 'https://via.placeholder.com/150'} alt={update.title} className="w-32 h-32 object-cover rounded mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">{update.title}</h2>
                  <p className="text-gray-300 mb-2 text-center">{update.description}</p>
                  <span className="text-gray-400 text-sm mb-2">{formatDate(update.date)}</span>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-3 py-1 text-xs rounded bg-purple-700 text-white hover:bg-purple-800 font-semibold border border-purple-800 shadow"
                      onClick={() => console.log('Update', update.id || update._id)}
                    >
                      Update
                    </button>
                    {confirmDeleteId === (update.id || update._id) ? (
                      <>
                        <button
                          className="px-3 py-1 text-xs rounded bg-red-700 text-white hover:bg-red-800 font-semibold border border-red-800 shadow"
                          onClick={async () => {
                            setDeletingId(update.id || update._id);
                            try {
                              await axios.delete(API_ENDPOINTS.DELETE_UPDATE(update.id || update._id));
                              setConfirmDeleteId(null);
                              // Refresh updates
                              setLoading(true);
                              setError('');
                              try {
                                const response = await axios.get(API_ENDPOINTS.UPDATES);
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
                          }}
                          disabled={deletingId === (update.id || update._id)}
                        >
                          {deletingId === (update.id || update._id) ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button
                          className="px-3 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-700 font-semibold border border-gray-700 shadow"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-3 py-1 text-xs rounded bg-red-700 text-white hover:bg-red-800 font-semibold border border-red-800 shadow"
                        onClick={() => setConfirmDeleteId(update.id || update._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Updates; 