import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLock, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import UpdateTicketForm from '../components/UpdateTicketForm';
import { API_ENDPOINTS } from '../config/api';

function TicketDetails() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingIEEE, setEditingIEEE] = useState(null); // ticketId being edited
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyNewPassword, setVerifyNewPassword] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [ieeeFilter, setIeeeFilter] = useState('');
  const [ieeeVerifiedFilter, setIeeeVerifiedFilter] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [editingTicket, setEditingTicket] = useState(null); // ticket being edited
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required.');
          setLoading(false);
          return;
        }
        const response = await axios.get(API_ENDPOINTS.ADMIN_DATA, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleEdit = (ticketId) => {
    const ticket = tickets.find(t => t._id === ticketId);
    setEditingTicket(ticket);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    window.location.reload(); // or redirect to login page
  };

  const handleVerifyIEEE = (ticketId) => {
    setEditingIEEE(ticketId);
  };

  const handleSetIEEEVerified = async (ticketId, value) => {
    // Optimistically update local state before API call
    setTickets(prev => prev.map(ticket =>
      ticket._id === ticketId ? { ...ticket, ieeeVerified: value } : ticket
    ));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.VERIFY_IEEE(ticketId), {
        ieeeVerificationCompleted: true,
        ieeeVerified: value
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally update local state again based on response
    } catch (err) {
      alert('Failed to update verification status.');
      console.error(err);
    }
    setEditingIEEE(null);
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  // Get unique institutions for dropdown
  const institutions = Array.from(new Set(tickets.map(t => t.institution).filter(Boolean)));
  const statuses = Array.from(new Set(tickets.map(t => t.status).filter(Boolean)));

  // Filtered tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesInstitution = institutionFilter ? ticket.institution === institutionFilter : true;
    const matchesIEEE = ieeeFilter ? ticket.isIEEEMember === ieeeFilter : true;
    const matchesIEEEVerified = ieeeVerifiedFilter === '' ? true : (ieeeVerifiedFilter === 'true' ? ticket.ieeeVerified === true : ticket.ieeeVerified === false);
    return matchesSearch && matchesStatus && matchesInstitution && matchesIEEE && matchesIEEEVerified;
  });

  if (loading) {
    return (
      <div className="text-white text-center text-2xl h-screen flex items-center justify-center">
        Loading tickets...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-2xl h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#18181b]">
      {/* Custom Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-gray-800 shadow z-20">
        <div className="flex items-center gap-2">
          <img src="/yess_icon.png" alt="YESS Logo" className="h-10 w-10" />
          <span className="text-white text-xl font-bold tracking-wide">YESS'25 Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {showChangePassword && (
            <div className="absolute top-20 right-10 bg-[#232326] border border-gray-700 rounded-lg shadow-lg p-6 z-30 w-80 flex flex-col gap-3">
              <h2 className="text-lg font-bold text-white mb-2">Change Password</h2>
              {changePasswordError && <div className="text-red-500 text-sm mb-2">{changePasswordError}</div>}
              {changePasswordSuccess && <div className="text-green-500 text-sm mb-2">{changePasswordSuccess}</div>}
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
              />
              <input
                type="password"
                placeholder="Verify New Password"
                value={verifyNewPassword}
                onChange={e => setVerifyNewPassword(e.target.value)}
                className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => { setShowChangePassword(false); setChangePasswordError(''); setChangePasswordSuccess(''); }}
                  className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setChangePasswordError('');
                    setChangePasswordSuccess('');
                    if (newPassword !== verifyNewPassword) {
                      setChangePasswordError('New passwords do not match.');
                      return;
                    }
                    if (!currentPassword || !newPassword) {
                      setChangePasswordError('Please fill all fields.');
                      return;
                    }
                    try {
                      const username = localStorage.getItem('admin');
                      const token = localStorage.getItem('token');
                      const response = await axios.post(API_ENDPOINTS.ADMIN_CHANGE_PASSWORD, {
                        username,
                        currentPassword,
                        newPassword
                      }, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      setChangePasswordSuccess('Password changed successfully!');
                      setCurrentPassword('');
                      setNewPassword('');
                      setVerifyNewPassword('');
                      setTimeout(() => {
                        setShowChangePassword(false);
                        setChangePasswordSuccess('');
                      }, 1500);
                    } catch (err) {
                      setChangePasswordError(
                        err.response?.data?.message || 'Failed to change password. Please try again.'
                      );
                    }
                  }}
                  className="px-4 py-2 rounded bg-[#fe4a56] text-white hover:bg-[#8c0505] text-sm font-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate('/admin/add')}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors border border-green-800 shadow"
          >
            + Add New User
          </button>
          <button
            onClick={() => navigate('/admin/event-details')}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors border border-blue-800 shadow"
          >
            Event Details
          </button>
          <button
            onClick={() => navigate('/admin/updates')}
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors border border-purple-800 shadow"
          >
            Updates
          </button>
          <button
            onClick={handleChangePassword}
            className="flex items-center gap-2 bg-[#fe4a56] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#8c0505] transition-colors border border-[#fe4a56] hover:border-[#8c0505] focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2"
          >
            <FiLock className="w-5 h-5" />
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-700/80 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors border border-red-900 shadow"
          >
            <FiLogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </header>
      {/* Filters Section */}
      <div className="w-full flex flex-wrap items-center gap-4 px-6 py-4 bg-[#232326] border-b border-gray-800 z-10">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56] w-64"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="attempted">Attempted</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={institutionFilter}
          onChange={e => setInstitutionFilter(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
        >
          <option value="">All Institutions</option>
          {institutions.map(inst => (
            <option key={inst} value={inst}>{inst}</option>
          ))}
        </select>
        <select
          value={ieeeFilter}
          onChange={e => setIeeeFilter(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
        >
          <option value="">All IEEE Members</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="gsm">GSM</option>
        </select>
        <select
          value={ieeeVerifiedFilter}
          onChange={e => setIeeeVerifiedFilter(e.target.value)}
          className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
        >
          <option value="">All Verified Status</option>
          <option value="true">Verified</option>
          <option value="false">Not Verified</option>
        </select>
        <button
          onClick={() => { setSearch(''); setStatusFilter(''); setInstitutionFilter(''); setIeeeFilter(''); setIeeeVerifiedFilter(''); }}
          className="bg-gray-700 text-gray-200 px-4 py-2 rounded hover:bg-gray-600 border border-gray-600"
        >
          Reset
        </button>
        <span className="ml-auto text-gray-300 text-sm font-semibold">
          Showing {filteredTickets.length} result{filteredTickets.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="w-full" style={{ height: 'calc(100vh - 72px - 64px)' }}>
        {/* Show UpdateTicketForm modal if editingTicket is set */}
        {editingTicket && (
          <UpdateTicketForm
            ticket={editingTicket}
            onClose={() => setEditingTicket(null)}
            onSave={updatedTicket => {
              setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
              setEditingTicket(null);
            }}
          />
        )}
        <div
          className="flex flex-col items-center text-white p-4 pb-16 overflow-y-auto w-full h-full \
            [&::-webkit-scrollbar]:w-2 \
            [&::-webkit-scrollbar-track]:bg-transparent \
            [&::-webkit-scrollbar-thumb]:bg-[#fe4a56]/60 \
            [&::-webkit-scrollbar-thumb]:rounded-full \
            hover:[&::-webkit-scrollbar-thumb]:bg-[#fe4a56]/90"
        >
          <h1 className="text-3xl font-bold mb-8 nunito-sans-body">Ticket Details</h1>
          <div className="w-full max-w-6xl space-y-8 pb-8">
            {filteredTickets.map((ticket) => (
              <div key={ticket._id} className="bg-[#232326] rounded-xl shadow p-6 flex flex-col relative overflow-x-auto border border-gray-800 nunito-sans-body">
                {/* Status badge */}
                <span className={`absolute top-4 right-6 px-4 py-1 rounded-full text-xs font-semibold nunito-sans-body ${
                  ticket.status === 'paid' ? 'bg-green-900/80 text-green-200' : 
                  ticket.status === 'attempted' ? 'bg-orange-900/80 text-orange-200' : 
                  'bg-yellow-900/80 text-yellow-200'
                }`}>
                  {ticket.status === 'paid' ? 'Paid' : 
                   ticket.status === 'attempted' ? 'Attempted' : 
                   ticket.status}
                </span>
                {/* Details (no image, no documents) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0 nunito-sans-body">
                  {/* Personal Info & Preferences */}
                  <div className="min-w-0 break-words nunito-sans-body">
                    <h2 className="text-xl font-bold mb-2 text-gray-100 truncate nunito-sans-body">{ticket.fullName}</h2>
                    <div className="text-gray-400 text-sm mb-1 nunito-sans-body">Contact Information</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">{ticket.email}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">{ticket.phone}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Gender: {ticket.gender}</div>
                    <div className="text-gray-400 text-sm mb-1 mt-4 nunito-sans-body">Preferences</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Food: {ticket.foodPreference}</div>
                  </div>
                  {/* Educational Details */}
                  <div className="min-w-0 break-words nunito-sans-body">
                    <div className="text-gray-400 text-sm mb-1 nunito-sans-body">Educational Details</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Institution: {ticket.institution}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Course: {ticket.course}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Year: {ticket.yearOfStudy}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">IEEE Member: {ticket.isIEEEMember}</div>
                    {ticket.ieeeMembershipNumber && (
                      <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">IEEE No: {ticket.ieeeMembershipNumber}</div>
                    )}
                    <div className="mb-2 text-sm flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full font-semibold text-xs inline-block whitespace-nowrap w-fit ${ticket.ieeeVerificationCompleted === true ? 'bg-green-900/80 text-green-200' : 'bg-yellow-900/80 text-yellow-200'}`}>
                        Verification Completed: {ticket.ieeeVerificationCompleted === true ? 'Yes' : 'No'}
                      </span>
                      <span className={`px-2 py-1 rounded-full font-semibold text-xs inline-block whitespace-nowrap w-fit ${ticket.ieeeVerified === true ? 'bg-green-900/80 text-green-200' : 'bg-red-900/80 text-red-200'}`}>
                        Verified: {ticket.ieeeVerified === true ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  {/* Payment Details */}
                  <div className="min-w-0 break-words nunito-sans-body">
                    <div className="text-gray-400 text-sm mb-1 nunito-sans-body">Payment Details</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Amount: ₹{(ticket.amount / 100).toFixed(2)}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Amount Paid: ₹{(ticket.amount_paid / 100).toFixed(2)}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment Status: {ticket.paymentStatus}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment Verified: {ticket.paymentVerified ? 'Yes' : 'No'}</div>
                    {ticket.paymentId && (
                      <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment ID: {ticket.paymentId}</div>
                    )}
                  </div>
                  {/* Ticket Details */}
                  <div className="min-w-0 break-words nunito-sans-body">
                    <div className="text-gray-400 text-sm mb-1 nunito-sans-body">Ticket Details</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">YESS Ticket ID: {ticket.yessTicketId}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Order ID: {ticket.orderId}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Receipt: {ticket.receipt}</div>
                    <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Registered: {ticket.timestamp ? new Date(ticket.timestamp).toLocaleString() : ''}</div>
                    {ticket.paymentCompletedAt && (
                      <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment Completed: {new Date(ticket.paymentCompletedAt).toLocaleString()}</div>
                    )}
                    {ticket.paymentVerifiedAt && (
                      <div className="mb-2 text-gray-200 text-sm break-words nunito-sans-body">Payment Verified: {new Date(ticket.paymentVerifiedAt).toLocaleString()}</div>
                    )}
                  </div>
                </div>
                {/* Action buttons below details, aligned right */}
                <div className="flex justify-end mt-6 gap-3">
                  {ticket.ieeeMembershipNumber && (
                    editingIEEE === ticket._id ? (
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleSetIEEEVerified(ticket._id, true)}
                          className="px-2 py-1 rounded text-xs font-semibold border bg-green-700 text-white border-green-800 hover:bg-green-800 transition-colors"
                          title="Set Verified True"
                        >
                          True
                        </button>
                        <button
                          onClick={() => handleSetIEEEVerified(ticket._id, false)}
                          className="px-2 py-1 rounded text-xs font-semibold border bg-red-700 text-white border-red-800 hover:bg-red-800 transition-colors"
                          title="Set Verified False"
                        >
                          False
                        </button>
                        <button
                          onClick={() => setEditingIEEE(null)}
                          className="px-2 py-1 rounded text-xs font-semibold border bg-gray-600 text-white border-gray-700 hover:bg-gray-700 transition-colors"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVerifyIEEE(ticket._id)}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold border transition-colors shadow nunito-sans-body bg-[#fe4a56] text-white border-[#fe4a56] hover:bg-[#8c0505] hover:border-[#8c0505] focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2`}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        Verify IEEE Number
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handleEdit(ticket._id)}
                    className="flex items-center gap-1 bg-[#fe4a56] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#8c0505] transition-colors shadow border border-[#fe4a56] hover:border-[#8c0505] focus:outline-none focus:ring-2 focus:ring-[#fe4a56] focus:ring-offset-2 nunito-sans-body"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z"/></svg>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails; 