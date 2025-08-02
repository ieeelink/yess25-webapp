import React from 'react';
import { FiSettings, FiX } from 'react-icons/fi';

const DebugTicketPanel = ({
  showDebugPanel,
  setShowDebugPanel,
  debugInfo,
  setDebugInfo,
  debugTicketId,
  setDebugTicketId,
  loadingDebug,
  debugTicket
}) => {
  if (!showDebugPanel) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#232326] rounded-xl shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Debug Panel Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <FiSettings className="text-2xl text-orange-400" />
            <h2 className="text-xl font-bold text-white font-nunito">Debug Ticket Information</h2>
          </div>
          <button
            onClick={() => {
              setShowDebugPanel(false);
              setDebugInfo(null);
              setDebugTicketId('');
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Debug Panel Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {!debugInfo ? (
            /* Debug Input Form */
            <div className="space-y-4">
              <div className="text-center">
                <FiSettings className="mx-auto text-6xl text-orange-400 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-white mb-2 font-nunito">Debug Ticket</h3>
                <p className="text-gray-400 font-nunito">Enter a ticket ID to view detailed debugging information</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-300 mb-2">Ticket ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={debugTicketId}
                    onChange={(e) => setDebugTicketId(e.target.value)}
                    placeholder="Enter MongoDB ObjectId..."
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    onClick={() => debugTicket(debugTicketId)}
                    disabled={!debugTicketId.trim() || loadingDebug}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-nunito"
                  >
                    {loadingDebug ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      'Debug'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Debug Results */
            <div className="space-y-6">
              {/* Ticket Basic Info */}
              <div className="bg-[#2a2a2c] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 font-nunito">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Ticket ID</label>
                    <div className="p-2 bg-gray-700 rounded text-white font-mono text-sm">
                      {debugInfo.ticketId || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">YESS Ticket ID</label>
                    <div className="p-2 bg-gray-700 rounded text-white font-mono text-sm">
                      {debugInfo.rawTicket.rawData.yessTicketId || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Registration ID</label>
                    <div className="p-2 bg-gray-700 rounded text-white font-mono text-sm">
                      {debugInfo.rawTicket.rawData.registrationId || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.fullName || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.email || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.phone || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal & Academic Info */}
              <div className="bg-[#2a2a2c] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3 font-nunito">Personal & Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.gender || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Year of Study</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.yearOfStudy || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.institution || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Course</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.course || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Food Preference</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.foodPreference || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Source</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      {debugInfo.rawTicket.rawData.source || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* IEEE Verification Status */}
              <div className="bg-[#2a2a2c] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-3 font-nunito">IEEE Verification Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Is IEEE Member</label>
                    <div className={`p-2 rounded text-sm font-medium ${
                      debugInfo.rawTicket.rawData.isIEEEMember === 'yes' 
                        ? 'bg-green-600/20 text-green-300' 
                        : debugInfo.rawTicket.rawData.isIEEEMember === 'no'
                        ? 'bg-red-600/20 text-red-300'
                        : 'bg-gray-600/20 text-gray-300'
                    }`}>
                      {debugInfo.rawTicket.rawData.isIEEEMember || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">IEEE Membership Number</label>
                    <div className="p-2 bg-gray-700 rounded text-white font-mono text-sm">
                      {debugInfo.rawTicket.rawData.ieeeMembershipNumber || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">IEEE Verified</label>
                    <div className={`p-2 rounded text-sm font-medium ${
                      debugInfo.rawTicket.rawData.ieeeVerified 
                        ? 'bg-green-600/20 text-green-300' 
                        : 'bg-red-600/20 text-red-300'
                    }`}>
                      {debugInfo.rawTicket.rawData.ieeeVerified ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">IEEE Verification Completed</label>
                    <div className={`p-2 rounded text-sm font-medium ${
                      debugInfo.rawTicket.rawData.ieeeVerificationCompleted 
                        ? 'bg-green-600/20 text-green-300' 
                        : 'bg-yellow-600/20 text-yellow-300'
                    }`}>
                      {debugInfo.rawTicket.rawData.ieeeVerificationCompleted ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-[#2a2a2c] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3 font-nunito">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
                    <div className={`p-2 rounded text-sm font-medium ${
                      debugInfo.rawTicket.rawData.paymentStatus === 'paid' 
                        ? 'bg-green-600/20 text-green-300' 
                        : debugInfo.rawTicket.rawData.paymentStatus === 'pending'
                        ? 'bg-yellow-600/20 text-yellow-300'
                        : 'bg-red-600/20 text-red-300'
                    }`}>
                      {debugInfo.rawTicket.rawData.paymentStatus || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Verified</label>
                    <div className={`p-2 rounded text-sm font-medium ${
                      debugInfo.rawTicket.rawData.paymentVerified 
                        ? 'bg-green-600/20 text-green-300' 
                        : 'bg-red-600/20 text-red-300'
                    }`}>
                      {debugInfo.rawTicket.rawData.paymentVerified ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment ID</label>
                    <div className="p-2 bg-gray-700 rounded text-white font-mono text-sm">
                      {debugInfo.rawTicket.rawData.paymentId || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                    <div className="p-2 bg-gray-700 rounded text-white text-sm">
                      ₹{debugInfo.rawTicket.rawData.amount ? (debugInfo.rawTicket.rawData.amount / 100).toFixed(2) : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <div className={`p-2 rounded text-sm font-medium ${
                      debugInfo.rawTicket.rawData.status === 'paid' 
                        ? 'bg-green-600/20 text-green-300' 
                        : debugInfo.rawTicket.rawData.status === 'pending'
                        ? 'bg-yellow-600/20 text-yellow-300'
                        : 'bg-red-600/20 text-red-300'
                    }`}>
                      {debugInfo.rawTicket.rawData.status || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Agreed to Terms</label>
                    <div className={`p-2 rounded text-sm font-medium ${
                      debugInfo.rawTicket.rawData.agreedToTerms 
                        ? 'bg-green-600/20 text-green-300' 
                        : 'bg-red-600/20 text-red-300'
                    }`}>
                      {debugInfo.rawTicket.rawData.agreedToTerms ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-[#2a2a2c] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3 font-nunito">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Registration Timestamp</label>
                    <div className="p-2 bg-gray-700 rounded text-white font-mono text-xs">
                      {debugInfo.rawTicket.rawData.timestamp ? new Date(debugInfo.rawTicket.rawData.timestamp).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Completed At</label>
                    <div className="p-2 bg-gray-700 rounded text-white font-mono text-xs">
                      {debugInfo.rawTicket.rawData.paymentCompletedAt ? new Date(debugInfo.rawTicket.rawData.paymentCompletedAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Verified At</label>
                    <div className="p-2 bg-gray-700 rounded text-white font-mono text-xs">
                      {debugInfo.rawTicket.rawData.paymentVerifiedAt ? new Date(debugInfo.rawTicket.rawData.paymentVerifiedAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Data */}
              <div className="bg-[#2a2a2c] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-400 mb-3 font-nunito">Raw Ticket Data</h3>
                <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Debug Panel Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-end gap-2 flex-shrink-0">
          {debugInfo && (
            <button
              onClick={() => {
                setDebugInfo(null);
                setDebugTicketId('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-nunito"
            >
              Debug Another Ticket
            </button>
          )}
          <button
            onClick={() => {
              setShowDebugPanel(false);
              setDebugInfo(null);
              setDebugTicketId('');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-nunito"
          >
            Close Debug Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugTicketPanel;
