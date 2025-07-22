import React, { useState } from 'react';
// import Header from '../components/Header';
// import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    axios.post('https://yess25-backend.up.railway.app/api/admin/login', { username, password })
      .then(response => {
        setSuccess(response.data.message);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('admin', response.data.username);
          navigate('/admin/ticket-details');
        }
        setUsername('');
        setPassword('');
      })
      .catch(error => {
        if (error.response && error.response.data) {
          if (error.response.data.error) {
            setError(error.response.data.error);
          } else if (error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError('An error occurred during login. Please try again.');
          }
        } else {
          setError('An error occurred during login. Please try again.');
        }
        console.error('Error logging in:', error);
      });
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="h-full flex flex-col relative z-10 bg-white/10">
        {/* <Header /> */}
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-black/50 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-white-800">Admin Login</h2>
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
            <div className="mb-6">
              <label className="block text-white-700 mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#fe4a56] text-white py-2 rounded font-semibold hover:bg-[#ea1212] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
        {/* <SubFooter /> */}
      </div>
    </div>
  );
}

export default AdminLogin; 