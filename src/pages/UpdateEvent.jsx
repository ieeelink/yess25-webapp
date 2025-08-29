import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function UpdateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();
  const { eventId } = useParams();

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      setFetchLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_ENDPOINTS.API_BASE}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const event = response.data;
        setTitle(event.title || '');
        setDescription(event.description || '');
        setStartTime(event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '');
        setEndTime(event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '');
        setLocation(event.location || '');
        setCurrentImageUrl(event.image || '');
      } catch (err) {
        setError('Failed to fetch event data. Please try again.');
        console.error('Error fetching event:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!title || !description) {
      setError('Please fill in the title and description fields.');
      return;
    }
    
    setLoading(true);
    try {
      let imageUrl = currentImageUrl;
      
      // Upload new image if one was selected
      if (image) {
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const formData = new FormData();
        formData.append('image', image);
        const imgbbRes = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
        imageUrl = imgbbRes.data.data.url;
      }
      
      // Update event data
      const token = localStorage.getItem('token');
      const eventData = {
        title,
        description,
        image: imageUrl
      };
      
      // Add optional fields if they have values
      if (startTime) eventData.startTime = startTime;
      if (endTime) eventData.endTime = endTime;
      if (location) eventData.location = location;
      
      await axios.put(`${API_ENDPOINTS.API_BASE}/events/${eventId}`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Event updated successfully!');
      setTimeout(() => navigate('/admin/event-details'), 1200);
    } catch (err) {
      setError('Failed to update event. Please try again.');
      console.error('Error updating event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
        <div className="text-white text-xl">Loading event data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <form onSubmit={handleSubmit} className="bg-[#232326] p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-800 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2">Update Event</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
        />
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] min-h-[100px]"
        />
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1">Start Time (Optional)</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1">End Time (Optional)</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
          />
        </div>
        
        <input
          type="text"
          placeholder="Location (Optional)"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
        />
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Event Image</label>
          {currentImageUrl && (
            <div className="mb-3">
              <img 
                src={currentImageUrl} 
                alt="Current event" 
                className="w-full h-32 object-cover rounded border border-gray-600"
              />
              <p className="text-gray-400 text-xs mt-1">Current image (upload a new one to replace)</p>
            </div>
          )}
          <label htmlFor="event-image" className="inline-block px-4 py-2 bg-blue-700 text-white rounded cursor-pointer hover:bg-blue-800 font-semibold transition-colors border border-blue-800 shadow">
            {image ? 'Change Image' : 'Upload New Image (Optional)'}
          </label>
          <input
            id="event-image"
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="hidden"
          />
          {image && <span className="ml-3 text-gray-300 text-sm break-all">{image.name}</span>}
        </div>
        
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm font-semibold"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 text-sm font-semibold"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEvent;
