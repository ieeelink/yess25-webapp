import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function AddUpdate() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [date, setDate] = useState('');
  const [hasLink, setHasLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to format date as dd/mm/yyyy
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || !description || !image || !date) {
      setError('Please fill all required fields, upload an image, and select a date.');
      return;
    }
    if (hasLink && (!linkTitle || !linkUrl)) {
      setError('Please fill both link title and URL when adding a link.');
      return;
    }
    setLoading(true);
    try {
      // 1. Upload image to imgbb
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const formData = new FormData();
      formData.append('image', image);
      const imgbbRes = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
      const imageUrl = imgbbRes.data.data.url;
      // 2. Send update data to server
      const updateData = {
        title,
        subtitle,
        description,
        image: imageUrl,
        date,
        hasLink: hasLink // Send as boolean
      };
      
      // Add link data if toggle is enabled and both fields are filled
      if (hasLink && linkTitle && linkUrl) {
        updateData.linkTitle = linkTitle;
        updateData.linkUrl = linkUrl;
      }
      
      await axios.post(API_ENDPOINTS.UPDATES, updateData);
      setSuccess('Update submitted successfully!');
      setTitle('');
      setSubtitle('');
      setDescription('');
      setImage(null);
      setDate('');
      setHasLink(false);
      setLinkTitle('');
      setLinkUrl('');
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setError('Failed to submit update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <form onSubmit={handleSubmit} className="bg-[#232326] p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-800 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2">Add Update</h2>
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
        <label htmlFor="update-date" className="text-gray-300 text-sm font-semibold mb-1 nunito-sans-body">Date</label>
        <input
          id="update-date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] nunito-sans-body"
        />
        {date && (
          <span className="ml-2 text-gray-400 text-sm nunito-sans-body">{formatDate(date)}</span>
        )}
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] min-h-[100px] nunito-sans-body"
        />
        <div>
          <label htmlFor="update-image" className="inline-block px-4 py-2 bg-purple-700 text-white rounded cursor-pointer hover:bg-purple-800 font-semibold transition-colors border border-purple-800 shadow">
            Choose Image
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
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm font-semibold"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 text-sm font-semibold"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUpdate;