import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function UpdateUpdate() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [hasLink, setHasLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();
  const { updateId } = useParams();

  // Helper to format date as dd/mm/yyyy for display
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return 'Invalid Date';
    }
  }

  // Fetch update data on component mount
  useEffect(() => {
    const fetchUpdate = async () => {
      setFetchLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_ENDPOINTS.API_BASE}/updates/${updateId}`, { headers });
        
        const update = response.data;
        setTitle(update.title || '');
        setSubtitle(update.subtitle || '');
        setDescription(update.description || '');
        setCurrentImageUrl(update.image || '');
        setDate(update.date || '');
        setHasLink(update.hasLink || false);
        setLinkTitle(update.linkTitle || '');
        setLinkUrl(update.linkUrl || '');
      } catch (err) {
        setError('Failed to fetch update data. Please try again.');
        console.error('Error fetching update:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    if (updateId) {
      fetchUpdate();
    }
  }, [updateId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!title || !description || !date) {
      setError('Please fill in the title, description, and date fields.');
      return;
    }

    if (hasLink && (!linkTitle || !linkUrl)) {
      setError('Please fill both link title and URL when link is enabled.');
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
      
      // Update update data
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const updateData = {
        title,
        subtitle,
        description,
        image: imageUrl,
        date,
        hasLink: hasLink
      };
      
      // Add link data if toggle is enabled and both fields are filled
      if (hasLink && linkTitle && linkUrl) {
        updateData.linkTitle = linkTitle;
        updateData.linkUrl = linkUrl;
      } else {
        // Clear link data if toggle is disabled
        updateData.linkTitle = '';
        updateData.linkUrl = '';
      }
      
      await axios.put(`${API_ENDPOINTS.API_BASE}/updates/${updateId}`, updateData, { headers });
      
      setSuccess('Update updated successfully!');
      setTimeout(() => navigate('/admin/updates'), 1200);
    } catch (err) {
      setError('Failed to update. Please try again.');
      console.error('Error updating update:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
        <div className="text-white text-xl nunito-sans-body">Loading update data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <form onSubmit={handleSubmit} className="bg-[#232326] p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-800 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2 nunito-sans-body">Update Update</h2>
        {error && <div className="text-red-500 text-sm nunito-sans-body">{error}</div>}
        {success && <div className="text-green-500 text-sm nunito-sans-body">{success}</div>}
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] nunito-sans-body"
        />
        
        <input
          type="text"
          placeholder="Subtitle (optional)"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] nunito-sans-body"
        />
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1 nunito-sans-body">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] nunito-sans-body"
          />
          {date && (
            <span className="ml-2 text-gray-400 text-sm nunito-sans-body">{formatDate(date)}</span>
          )}
        </div>
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] min-h-[100px] nunito-sans-body"
        />
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2 nunito-sans-body">Update Image</label>
          {currentImageUrl && (
            <div className="mb-3">
              <img 
                src={currentImageUrl} 
                alt="Current update" 
                className="w-full h-32 object-cover rounded border border-gray-600"
              />
              <p className="text-gray-400 text-xs mt-1 nunito-sans-body">Current image (upload a new one to replace)</p>
            </div>
          )}
          <label htmlFor="update-image" className="inline-block px-4 py-2 bg-purple-700 text-white rounded cursor-pointer hover:bg-purple-800 font-semibold transition-colors border border-purple-800 shadow nunito-sans-body">
            {image ? 'Change Image' : 'Upload New Image (Optional)'}
          </label>
          <input
            id="update-image"
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="hidden"
          />
          {image && <span className="ml-3 text-gray-300 text-sm break-all nunito-sans-body">{image.name}</span>}
        </div>
        
        {/* Link Toggle Switch */}
        <div className="flex items-center gap-3">
          <label className="text-gray-300 text-sm font-semibold nunito-sans-body">Add Link:</label>
          <button
            type="button"
            onClick={() => {
              setHasLink(!hasLink);
              if (hasLink) {
                setLinkTitle('');
                setLinkUrl('');
              }
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              hasLink ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                hasLink ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {/* Link Input Fields - Conditional */}
        {hasLink && (
          <>
            <input
              type="text"
              placeholder="Link Title"
              value={linkTitle}
              onChange={e => setLinkTitle(e.target.value)}
              className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] nunito-sans-body"
            />
            <input
              type="url"
              placeholder="Link URL (e.g., https://example.com)"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] nunito-sans-body"
            />
          </>
        )}
        
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm font-semibold nunito-sans-body"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 text-sm font-semibold nunito-sans-body"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateUpdate;
