import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function AddAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // TODO: Implement actual admin creation logic
    axios.post(API_ENDPOINTS.ADMIN_ADD_USER, { username, password })
      .then(response => {
        setSuccess(response.data.message);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred while adding the admin. Please try again.');
        }
        console.error('Error adding admin:', error);
      });
    return;
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="h-full flex flex-col relative z-10 bg-white/10">
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-black/50 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-white-800">Add New Admin</h2>
            {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
            {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
            <div className="mb-4">
              <label className="block text-white-700 mb-2" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white-700 mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-white-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#fe4a56] text-white py-2 rounded font-semibold hover:bg-[#ea1212] transition-colors"
            >
              Add Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAdmin; 