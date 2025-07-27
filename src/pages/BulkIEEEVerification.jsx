import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiDownload, FiArrowLeft, FiCheck, FiX, FiBarChart2 } from 'react-icons/fi';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

function BulkIEEEVerification() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationResults, setVerificationResults] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [unverifiedTickets, setUnverifiedTickets] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
    
    .custom-scrollbar-green::-webkit-scrollbar-thumb {
      background: rgba(34, 197, 94, 0.6);
    }
    
    .custom-scrollbar-green::-webkit-scrollbar-thumb:hover {
      background: rgba(34, 197, 94, 0.8);
    }
    
    .custom-scrollbar-red::-webkit-scrollbar-thumb {
      background: rgba(239, 68, 68, 0.6);
    }
    
    .custom-scrollbar-red::-webkit-scrollbar-thumb:hover {
      background: rgba(239, 68, 68, 0.8);
    }
    
    .custom-scrollbar-yellow::-webkit-scrollbar-thumb {
      background: rgba(251, 191, 36, 0.6);
    }
    
    .custom-scrollbar-yellow::-webkit-scrollbar-thumb:hover {
      background: rgba(251, 191, 36, 0.8);
    }
    
    /* Firefox scrollbar */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.6) rgba(75, 85, 99, 0.3);
    }
    
    .custom-scrollbar-green {
      scrollbar-color: rgba(34, 197, 94, 0.6) rgba(75, 85, 99, 0.3);
    }
    
    .custom-scrollbar-red {
      scrollbar-color: rgba(239, 68, 68, 0.6) rgba(75, 85, 99, 0.3);
    }
    
    .custom-scrollbar-yellow {
      scrollbar-color: rgba(251, 191, 36, 0.6) rgba(75, 85, 99, 0.3);
    }
  `;

  // Helper function to parse CSV content
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 2) {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        records.push(record);
      }
    }
    
    return records;
  };

  // Helper function to normalize IEEE member data from different CSV formats
  const normalizeIEEERecord = (record) => {
    // Handle official IEEE export format
    if (record['Member/Customer Number']) {
      return {
        ieee_number: record['Member/Customer Number']?.toString().trim(),
        first_name: record['First Name']?.trim() || '',
        last_name: record['Last Name']?.trim() || '',
        institution: record['School Name']?.trim() || ''
      };
    }
    
    // Handle template format
    return {
      ieee_number: record['ieee_number']?.toString().trim(),
      first_name: record['first_name']?.trim() || '',
      last_name: record['last_name']?.trim() || '',
      institution: record['institution']?.trim() || ''
    };
  };

  // Helper function to generate name variations for matching
  const generateNameVariations = (firstName, lastName) => {
    const variations = [];
    if (firstName && lastName) {
      variations.push(
        `${firstName} ${lastName}`.toLowerCase(),
        `${lastName} ${firstName}`.toLowerCase(),
        `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
        `${lastName.toLowerCase()} ${firstName.toLowerCase()}`,
        `${firstName} ${lastName}`,
        `${lastName} ${firstName}`
      );
    }
    return [...new Set(variations)]; // Remove duplicates
  };

  // Helper function to calculate name similarity
  const calculateNameSimilarity = (name1, name2) => {
    const normalize = (str) => str.toLowerCase().replace(/\s+/g, ' ').trim();
    const n1 = normalize(name1);
    const n2 = normalize(name2);
    
    if (n1 === n2) return 1.0;
    if (n1.includes(n2) || n2.includes(n1)) return 0.8;
    
    // Simple word overlap check
    const words1 = n1.split(' ');
    const words2 = n2.split(' ');
    const overlap = words1.filter(word => words2.includes(word)).length;
    const total = Math.max(words1.length, words2.length);
    
    return overlap / total;
  };

  // Function to match IEEE members with unverified tickets
  const matchIEEEMembers = (ieeeMembers, tickets) => {
    const results = {
      verified: 0,
      failed: 0,
      notFound: 0,
      total: ieeeMembers.length,
      details: [],
      matchedTickets: []
    };

    for (const member of ieeeMembers) {
      if (!member.ieee_number) {
        results.failed++;
        results.details.push({
          ieee_number: member.ieee_number || 'N/A',
          name: `${member.first_name} ${member.last_name}`,
          status: 'failed',
          message: 'Missing IEEE number in uploaded data'
        });
        continue;
      }

      // Strategy 1: Exact IEEE number match
      let matchedTicket = tickets.find(ticket => 
        ticket.ieeeMembershipNumber === member.ieee_number
      );

      if (matchedTicket) {
        results.verified++;
        results.details.push({
          ieee_number: member.ieee_number,
          name: `${member.first_name} ${member.last_name}`,
          ticket_name: matchedTicket.fullName,
          status: 'verified',
          message: 'IEEE number matches exactly with ticket'
        });
        results.matchedTickets.push({
          ticketId: matchedTicket._id,
          ieeeVerified: true
        });
        continue;
      }

      // Strategy 2: Name similarity matching for tickets without IEEE numbers
      const nameVariations = generateNameVariations(member.first_name, member.last_name);
      let bestMatch = null;
      let bestSimilarity = 0;

      for (const ticket of tickets) {
        if (ticket.ieeeMembershipNumber) continue; // Skip tickets with IEEE numbers
        
        const ticketNameLower = ticket.fullName.toLowerCase();
        for (const nameVar of nameVariations) {
          const similarity = calculateNameSimilarity(nameVar, ticketNameLower);
          if (similarity > bestSimilarity && similarity > 0.7) {
            bestSimilarity = similarity;
            bestMatch = ticket;
          }
        }
      }

      if (bestMatch) {
        results.verified++;
        results.details.push({
          ieee_number: member.ieee_number,
          name: `${member.first_name} ${member.last_name}`,
          ticket_name: bestMatch.fullName,
          status: 'verified',
          message: `Matched by name similarity (${Math.round(bestSimilarity * 100)}%)`
        });
        results.matchedTickets.push({
          ticketId: bestMatch._id,
          ieeeVerified: true,
          ieeeMembershipNumber: member.ieee_number
        });
      } else {
        results.notFound++;
        results.details.push({
          ieee_number: member.ieee_number,
          name: `${member.first_name} ${member.last_name}`,
          status: 'not_found',
          message: 'No matching ticket found for this IEEE member'
        });
      }
    }

    // Add unmatched tickets to results
    const matchedTicketIds = results.matchedTickets.map(mt => mt.ticketId);
    const unmatchedTickets = tickets.filter(ticket => !matchedTicketIds.includes(ticket._id));
    
    unmatchedTickets.forEach(ticket => {
      results.failed++;
      results.details.push({
        ieee_number: ticket.ieeeMembershipNumber || 'Not provided',
        name: ticket.fullName,
        ticket_name: ticket.fullName,
        status: 'failed',
        message: 'No matching IEEE member found in uploaded CSV'
      });
    });

    results.total = results.verified + results.failed + results.notFound;

    return results;
  };

  // File upload handler
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size should be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  // File upload and verification process
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setIsProcessing(false);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        setIsUploading(false);
        return;
      }

      // Step 1: Fetch unverified IEEE tickets
      setUploadProgress(20);
      const ticketsResponse = await axios.get(API_ENDPOINTS.UNVERIFIED_IEEE, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const unverifiedTickets = ticketsResponse.data.tickets || ticketsResponse.data || [];
      setUnverifiedTickets(unverifiedTickets);
      setUploadProgress(40);

      // Step 2: Read and parse the uploaded CSV file
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(selectedFile);
      });

      setUploadProgress(60);

      // Step 3: Parse CSV and normalize IEEE member data
      const csvRecords = parseCSV(fileContent);
      const ieeeMembers = csvRecords.map(normalizeIEEERecord).filter(member => 
        member.ieee_number && (member.first_name || member.last_name)
      );

      if (ieeeMembers.length === 0) {
        setError('No valid IEEE member records found in the uploaded file. Please check the file format.');
        setIsUploading(false);
        return;
      }

      setUploadProgress(80);
      setIsProcessing(true);

      // Step 4: Perform client-side matching
      const matchingResults = matchIEEEMembers(ieeeMembers, unverifiedTickets);
      
      setUploadProgress(90);

      // Step 5: Prepare results (no verification updates sent to backend)
      console.log('Matching Results:', matchingResults);

      setUploadProgress(100);
      setVerificationResults(matchingResults);
      setSuccess(`Data matching completed! ${matchingResults.verified || 0} matches found, ${matchingResults.failed || 0} failed, ${matchingResults.notFound || 0} not found.`);
      
    } catch (err) {
      console.error('Data matching error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch and match data. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  // Download template file
  const downloadTemplate = () => {
    const csvContent = [
      'ieee_number,first_name,last_name,institution',
      '99739023,ALEESHA,SHAMINS,College of Engineering-Perumon',
      '100490042,Joshua,Bose,',
      '100087836,MOURYA,KAMBHAM,Amrita Vishwa Vidyapeetham',
      '99698005,Pavithra,Anil,Indian Inst of Space Science & Tech'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ieee_verification_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Clear file selection
  const clearFile = () => {
    setSelectedFile(null);
    setError('');
    setVerificationResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white nunito-sans-body">
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/ticket-details')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors nunito-sans-body"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Tickets
            </button>
            <h1 className="text-3xl font-bold text-white nunito-sans-body">Bulk IEEE Verification</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Instructions and Upload */}
          <div className="space-y-6">
            {/* Instructions Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-400 nunito-sans-body">How to use Bulk IEEE Verification</h2>
              <div className="space-y-3 text-gray-300 nunito-sans-body">
                <p>1. Download the template file to see the required format</p>
                <p>2. Your file should contain IEEE membership data with columns: <code className="bg-gray-700 px-2 py-1 rounded">ieee_number</code>, <code className="bg-gray-700 px-2 py-1 rounded">first_name</code>, <code className="bg-gray-700 px-2 py-1 rounded">last_name</code>, and optionally <code className="bg-gray-700 px-2 py-1 rounded">institution</code></p>
                <p>3. Upload your file using the upload section below</p>
                <p>4. The system will verify IEEE numbers against registered tickets by matching names and IEEE numbers</p>
                <p className="text-yellow-400 text-sm">
                  <strong>Note:</strong> The system will match IEEE numbers with ticket holders based on name similarity and IEEE membership numbers.
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors nunito-sans-body"
              >
                <FiDownload className="w-4 h-4" />
                Download Template
              </button>
              
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg">
                <h3 className="font-medium text-blue-300 mb-2 nunito-sans-body">Using Your IEEE Membership Data:</h3>
                <p className="text-sm text-blue-200 nunito-sans-body">
                  You can directly upload your IEEE membership CSV file with columns: 
                  <code className="bg-gray-700 px-1 py-0.5 rounded mx-1">School Name</code>,
                  <code className="bg-gray-700 px-1 py-0.5 rounded mx-1">Member/Customer Number</code>,
                  <code className="bg-gray-700 px-1 py-0.5 rounded mx-1">Last Name</code>,
                  <code className="bg-gray-700 px-1 py-0.5 rounded mx-1">First Name</code>
                </p>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 nunito-sans-body">Upload IEEE Verification File</h2>
              
              {/* File Upload Area */}
              <div className="mb-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    selectedFile 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FiCheck className="w-12 h-12 text-green-500 mx-auto" />
                      <p className="text-green-400 font-medium">{selectedFile.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={clearFile}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FiUpload className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-gray-300">
                        Drag and drop your file here, or{' '}
                        <label htmlFor="file-upload" className="text-blue-400 hover:text-blue-300 cursor-pointer">
                          browse
                        </label>
                      </p>
                      <p className="text-gray-500 text-sm">Supports CSV, XLSX, XLS (max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {(isUploading || isProcessing) && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      {uploadProgress < 40 ? 'Fetching unverified tickets...' :
                       uploadProgress < 60 ? 'Reading file...' :
                       uploadProgress < 80 ? 'Parsing IEEE data...' :
                       uploadProgress < 90 ? 'Matching records...' :
                       'Updating tickets...'}
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {isProcessing && (
                    <p className="text-sm text-blue-400 mt-2">
                      Processing {unverifiedTickets.length} unverified tickets...
                    </p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
                  <FiX className="inline w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-300">
                  <FiCheck className="inline w-4 h-4 mr-2" />
                  {success}
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading || isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  !selectedFile || isUploading || isProcessing
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isUploading ? 'Processing...' : isProcessing ? 'Matching & Updating...' : 'Process IEEE Verification'}
              </button>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="space-y-6">
            {verificationResults ? (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Verification Results</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{verificationResults.verified || 0}</div>
                    <div className="text-green-300">Verified</div>
                  </div>
                  <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">{verificationResults.failed || 0}</div>
                    <div className="text-red-300">Failed</div>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{verificationResults.notFound || 0}</div>
                    <div className="text-yellow-300">Not Found</div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{verificationResults.total || 0}</div>
                    <div className="text-blue-300">Total</div>
                  </div>
                </div>

                {verificationResults.details && verificationResults.details.filter(d => d.status === 'verified').length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-300">Matched Tickets:</h3>
                    
                    <div>
                      <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar custom-scrollbar-green">
                        {verificationResults.details.filter(d => d.status === 'verified').map((detail, index) => (
                          <div 
                            key={index}
                            className="p-3 rounded bg-green-900/30 text-green-300 border border-green-500/30"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono text-sm font-bold">{detail.ieee_number}</span>
                                <span className="mx-2">→</span>
                                <span className="font-medium">{detail.name}</span>
                                {detail.ticket_name && detail.ticket_name !== detail.name && (
                                  <div className="text-xs opacity-75 mt-1">
                                    Ticket: {detail.ticket_name}
                                  </div>
                                )}
                              </div>
                              <div className="text-xs opacity-75 font-medium">
                                MATCHED
                              </div>
                            </div>
                            <div className="text-xs mt-1 opacity-90">
                              {detail.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 border-dashed text-center">
                <div className="text-gray-400 mb-4">
                  <FiBarChart2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Results will appear here</h3>
                  <p className="text-sm">Upload and process your IEEE verification file to see detailed results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkIEEEVerification;
