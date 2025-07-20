import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddUpdate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [date, setDate] = useState('');
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
      setError('Please fill all fields, upload an image, and select a date.');
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
      await axios.post('http://localhost:3001/api/updates', {
        title,
        description,
        image: imageUrl,
        date
      });
      setSuccess('Update submitted successfully!');
      setTitle('');
      setDescription('');
      setImage(null);
      setDate('');
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
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
        />
        <label htmlFor="update-date" className="text-gray-300 text-sm font-semibold mb-1">Date</label>
        <input
          id="update-date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
        />
        {date && (
          <span className="ml-2 text-gray-400 text-sm">{formatDate(date)}</span>
        )}
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] min-h-[100px]"
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