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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);

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

  // Verify matched results
  const handleVerifyMatches = async () => {
    if (!verificationResults || !verificationResults.details) {
      setError('No verification results to process');
      return;
    }

    const matchedTickets = verificationResults.details.filter(d => d.status === 'verified');
    if (matchedTickets.length === 0) {
      setError('No matched tickets found to verify');
      return;
    }

    setIsVerifying(true);
    setVerificationProgress(0);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        setIsVerifying(false);
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < matchedTickets.length; i++) {
        const match = matchedTickets[i];
        const progress = Math.round(((i + 1) / matchedTickets.length) * 100);
        setVerificationProgress(progress);

        try {
          // Find the corresponding ticket ID from the original matching data
          const matchingResult = verificationResults.matchedTickets?.find(mt => 
            mt.ieeeMembershipNumber === match.ieee_number
          );
          
          if (!matchingResult) {
            failureCount++;
            continue;
          }

          await axios.patch(
            API_ENDPOINTS.ADMIN.UPDATE_IEEE_VERIFICATION.replace(':id', matchingResult.ticketId),
            { 
              isIEEEMember: true,
              ieeeMembershipNumber: match.ieee_number
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          successCount++;
        } catch (error) {
          console.error('Error verifying ticket:', error);
          failureCount++;
        }
      }

      setSuccess(`Verification complete! ${successCount} tickets verified successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}.`);
      
    } catch (error) {
      console.error('Verification error:', error);
      setError(`Verification failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsVerifying(false);
      setVerificationProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b]">
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      
      {/* Header */}
      <div className="bg-[#1a1a1a] shadow-md border-b border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/ticket-details')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-medium font-nunito">Back to Ticket Details</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white font-nunito">Bulk IEEE Verification</h1>
          <div className="w-48"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Column - Upload Section */}
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 flex flex-col border border-gray-700 h-[calc(100vh-180px)] sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-6 font-nunito">Upload IEEE Membership Data</h2>
              
              {/* Instructions */}
              <div className="mb-6 p-4 bg-[#2a2a2c] rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 font-nunito">Instructions:</h3>
                <ul className="text-sm text-gray-300 space-y-2 font-nunito">
                  <li>• Upload a CSV file with IEEE membership data</li>
                  <li>• Required columns: ieee_number, first_name, last_name</li>
                  <li>• Optional column: institution</li>
                  <li>• System will verify against registered tickets</li>
                  <li>• Data will be automatically displayed after upload</li>
                  <li>• Use the Verify button to start verification process</li>
                </ul>
              </div>

              {/* Template Download */}
              <div className="mb-6">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-nunito"
                >
                  <FiDownload className="text-lg" />
                  Download Template
                </button>
              </div>

              {/* File Upload Area */}
              <div className="flex-1 min-h-0">
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors h-full flex flex-col justify-center ${
                    selectedFile 
                      ? 'border-green-400 bg-green-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  
                  <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                  
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="text-green-400 font-semibold mb-2 font-nunito">
                        File Selected: {selectedFile.name}
                      </p>
                      <p className="text-gray-300 font-nunito">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={clearFile}
                        className="mt-2 text-red-400 hover:text-red-300 text-sm font-nunito"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-300 mb-2 font-nunito">
                        Drag and drop your IEEE data file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500 font-nunito">
                        Supports CSV, Excel files
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm font-nunito">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm font-nunito">{success}</p>
                </div>
              )}
            </div>

            {/* Right Column - Data Display and Processing */}
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 flex flex-col border border-gray-700 min-h-[calc(100vh-180px)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white font-nunito">
                  {verificationResults ? 'Verification Results' : 'IEEE Data Preview'}
                </h2>
                {selectedFile && !verificationResults && (
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-nunito"
                  >
                    {isUploading || isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiBarChart2 className="text-lg" />
                        Process IEEE Verification
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 min-h-0">
                {(isUploading || isProcessing) ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-4"></div>
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300 font-nunito">
                          {uploadProgress < 40 ? 'Fetching unverified tickets...' :
                           uploadProgress < 60 ? 'Reading file...' :
                           uploadProgress < 80 ? 'Parsing IEEE data...' :
                           uploadProgress < 90 ? 'Matching records...' :
                           'Updating tickets...'}
                        </span>
                        <span className="text-blue-400 font-nunito">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      {isProcessing && (
                        <p className="text-sm text-blue-400 mt-2 text-center font-nunito">
                          Processing {unverifiedTickets.length} unverified tickets...
                        </p>
                      )}
                    </div>
                  </div>
                ) : verificationResults ? (
                  /* Verification Results */
                  <div className="h-full flex flex-col">
                    {/* Results Summary */}
                    <div className="mb-4 p-4 bg-[#2a2a2c] rounded-lg border border-gray-600">
                      <h3 className="text-lg font-semibold text-white mb-4 font-nunito text-center">Verification Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="text-2xl font-bold text-green-400 font-nunito">{verificationResults.verified || 0}</div>
                          <div className="text-xs text-gray-400 font-nunito">Verified</div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div className="text-2xl font-bold text-red-400 font-nunito">{verificationResults.failed || 0}</div>
                          <div className="text-xs text-gray-400 font-nunito">Failed</div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                          <div className="text-2xl font-bold text-yellow-400 font-nunito">{verificationResults.notFound || 0}</div>
                          <div className="text-xs text-gray-400 font-nunito">Not Found</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="text-2xl font-bold text-blue-400 font-nunito">{verificationResults.total || 0}</div>
                          <div className="text-xs text-gray-400 font-nunito">Total</div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Progress */}
                    {isVerifying && (
                      <div className="mb-4 p-3 bg-[#2a2a2c] rounded-lg border border-gray-600">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300 font-nunito">Verifying IEEE memberships...</span>
                          <span className="text-green-400 font-nunito">{verificationProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${verificationProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Detailed Results */}
                    <div className="flex-1 overflow-auto custom-scrollbar">
                      <div className="space-y-3">
                        {verificationResults.details && verificationResults.details
                          .filter(detail => detail.status === 'verified')
                          .map((detail, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border-l-4 bg-green-500/10 border-green-400"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FiCheck className="text-green-400 text-lg" />
                                <div>
                                  <div className="font-semibold text-white font-nunito">
                                    IEEE #{detail.ieee_number}
                                  </div>
                                  <div className="text-sm text-gray-400 font-nunito">
                                    {detail.name}
                                  </div>
                                  {detail.ticket_name && (
                                    <div className="text-sm text-blue-400 font-nunito">
                                      Matched: {detail.ticket_name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-sm font-nunito text-green-400">
                                MATCHED
                              </div>
                            </div>
                          </div>
                        ))}
                        {verificationResults.details && verificationResults.details.filter(d => d.status === 'verified').length === 0 && (
                          <div className="text-center py-8">
                            <FiX className="mx-auto text-4xl text-gray-500 mb-3 opacity-50" />
                            <p className="text-gray-400 font-nunito">No verified matches found</p>
                            <p className="text-sm text-gray-500 font-nunito mt-1">Try uploading a different IEEE membership file</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verify Button */}
                    {verificationResults.details && verificationResults.details.filter(d => d.status === 'verified').length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <button
                          onClick={handleVerifyMatches}
                          disabled={isVerifying}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors font-nunito ${
                            isVerifying
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {isVerifying 
                            ? `Verifying... (${verificationProgress}%)` 
                            : `Verify ${verificationResults.details.filter(d => d.status === 'verified').length} Matched Tickets`
                          }
                        </button>
                      </div>
                    )}
                  </div>
                ) : selectedFile ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <FiBarChart2 className="mx-auto text-4xl mb-4 opacity-50" />
                      <p className="font-nunito">File uploaded successfully</p>
                      <p className="text-sm font-nunito mt-2">Click "Process IEEE Verification" to start</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FiUpload className="mx-auto text-4xl mb-4 opacity-50" />
                      <p className="font-nunito">Upload an IEEE data file to see verification results</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkIEEEVerification;
