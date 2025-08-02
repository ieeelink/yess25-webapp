import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiDownload, FiArrowLeft, FiCheck, FiX, FiBarChart2, FiTrash2 } from 'react-icons/fi';
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
  const [selectedCategory, setSelectedCategory] = useState('matched'); // 'all', 'matched', 'notMatched'
  const [excludedTickets, setExcludedTickets] = useState(new Set()); // Track excluded IEEE numbers
  const [verifyingTickets, setVerifyingTickets] = useState(new Set()); // Track tickets being verified
  const [verifiedTickets, setVerifiedTickets] = useState(new Map()); // Track verification results

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
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    // Find the relevant column indices
    const memberNumberIndex = headers.findIndex(h => 
      h.toLowerCase().includes('member') && h.toLowerCase().includes('number')
    );
    const firstNameIndex = headers.findIndex(h => 
      h.toLowerCase().includes('first') && h.toLowerCase().includes('name')
    );
    const lastNameIndex = headers.findIndex(h => 
      h.toLowerCase().includes('last') && h.toLowerCase().includes('name')
    );
    const institutionIndex = headers.findIndex(h => 
      h.toLowerCase().includes('school') || h.toLowerCase().includes('institution')
    );
    
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.trim().replace(/^"|"$/g, ''));
      
      if (columns[memberNumberIndex] && columns[memberNumberIndex] !== '') {
        records.push({
          memberNumber: columns[memberNumberIndex],
          firstName: columns[firstNameIndex] || '',
          lastName: columns[lastNameIndex] || '',
          institution: columns[institutionIndex] || ''
        });
      }
    }
    
    return records;
  };

  // Helper function to normalize IEEE member data from different CSV formats
  const normalizeIEEERecord = (record) => {
    // Removed normalization logic
    return {};
  };

  // Helper function to generate name variations for matching
  const generateNameVariations = (firstName, lastName) => {
    // Removed name variation logic
    return [];
  };

  // Helper function to calculate name similarity
  const calculateNameSimilarity = (name1, name2) => {
    // Removed similarity calculation logic
    return 0;
  };

  // Function to match IEEE members with unverified tickets
  const matchIEEEMembers = (ieeeMembers, unverifiedTickets) => {
    const matchedTickets = [];
    const notMatchedTickets = [];
    
    unverifiedTickets.forEach(ticket => {
      const ieeeNumber = ticket.ieeeMembershipNumber;
      const foundMember = ieeeMembers.find(member => 
        member.memberNumber === ieeeNumber
      );
      
      if (foundMember) {
        matchedTickets.push({
          ...ticket,
          status: 'matched',
          csvData: foundMember
        });
      } else {
        notMatchedTickets.push({
          ...ticket,
          status: 'not_matched'
        });
      }
    });
    
    return {
      matched: matchedTickets.length,
      notMatched: notMatchedTickets.length,
      total: unverifiedTickets.length,
      matchedTickets,
      notMatchedTickets,
      allTickets: [...matchedTickets, ...notMatchedTickets]
    };
  };

  // File upload handler
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      
      // Automatically process the file
      await processFile(file);
    }
  };

  // File processing function (extracted from handleUpload)
  const processFile = async (file) => {
    // Start processing animation
    setIsUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      // Step 1: Fetch unverified IEEE tickets (20%)
      setUploadProgress(20);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      const response = await axios.get(API_ENDPOINTS.UNVERIFIED_IEEE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const unverifiedTickets = response.data;
      setUnverifiedTickets(unverifiedTickets);
      
      // Step 2: Read and parse CSV file (40%)
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(40);
      
      const csvText = await file.text();
      const ieeeMembers = parseCSV(csvText);
      
      // Log parsed CSV data
      console.log('📋 Parsed CSV Data:', ieeeMembers);
      console.log(`📊 Total IEEE members found in CSV: ${ieeeMembers.length}`);
      
      // Step 3: Match IEEE members with tickets (60%)
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(60);
      
      const matchResults = matchIEEEMembers(ieeeMembers, unverifiedTickets);
      
      // Step 4: Process results (80%)
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(80);
      
      // Step 5: Finalize (100%)
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(100);

      // Show results
      setVerificationResults({
        matched: matchResults.matched,
        notMatched: matchResults.notMatched,
        total: matchResults.total,
        allTickets: matchResults.allTickets,
        matchedTickets: matchResults.matchedTickets,
        notMatchedTickets: matchResults.notMatchedTickets
      });
      
      setSuccess(`File processed successfully! Found ${matchResults.matched} matches out of ${matchResults.total} unverified tickets.`);
      
    } catch (error) {
      console.error('❌ Error processing file:', error);
      setError(`Failed to process file: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
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
    setSuccess('');
    setVerificationResults(null);
    setSelectedCategory('matched');
    setExcludedTickets(new Set());
    setVerifyingTickets(new Set());
    setVerifiedTickets(new Map());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove ticket from verification list
  const handleRemoveTicket = (ieeeNumber) => {
    setExcludedTickets(prev => new Set([...prev, ieeeNumber]));
  };

  // Get current filtered ticket IDs as a list
  const getCurrentTicketIds = () => {
    if (!verificationResults?.allTickets) return [];
    
    return verificationResults.allTickets
      .filter(ticket => {
        // First filter by excluded tickets
        if (excludedTickets.has(ticket.ieeeMembershipNumber)) return false;
        
        // Then filter by category
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'matched') return ticket.status === 'matched';
        if (selectedCategory === 'notMatched') return ticket.status === 'not_matched';
        return false;
      })
      .map(ticket => ticket._id)
      .filter(id => id); // Remove any undefined IDs
  };

  // Get all ticket IDs (regardless of filters)
  const getAllTicketIds = () => {
    if (!verificationResults?.allTickets) return [];
    return verificationResults.allTickets
      .map(ticket => ticket._id)
      .filter(id => id); // Remove any undefined IDs
  };

  // Get matched ticket IDs only
  const getMatchedTicketIds = () => {
    if (!verificationResults?.allTickets) return [];
    return verificationResults.allTickets
      .filter(ticket => ticket.status === 'matched' && !excludedTickets.has(ticket.ieeeMembershipNumber))
      .map(ticket => ticket._id)
      .filter(id => id); // Remove any undefined IDs
  };

  // Auto-log ticket IDs whenever verification results or filters change
  useEffect(() => {
    if (verificationResults?.allTickets) {
      console.log('📋 Ticket ID Lists:');
      console.log('  • Current filtered IDs:', getCurrentTicketIds());
      console.log('  • All ticket IDs:', getAllTicketIds());
      console.log('  • Matched ticket IDs:', getMatchedTicketIds());
    }
  }, [verificationResults, selectedCategory, excludedTickets, verifiedTickets]);

  // Verify matched results
  const handleVerifyMatches = async () => {
    if (!verificationResults?.allTickets) return;
    
    // Get tickets to verify (matched tickets not excluded)
    const ticketsToVerify = verificationResults.allTickets.filter(
      ticket => ticket.status === 'matched' && !excludedTickets.has(ticket.ieeeMembershipNumber)
    );
    
    if (ticketsToVerify.length === 0) {
      setError('No matched tickets to verify');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Process tickets one by one
      for (let i = 0; i < ticketsToVerify.length; i++) {
        const ticket = ticketsToVerify[i];
        
        try {
          // Mark ticket as being verified
          setVerifyingTickets(prev => new Set([...prev, ticket._id]));
          
          // Make API call to verify the ticket
          const response = await axios.post(
            API_ENDPOINTS.VERIFY_IEEE(ticket._id),
            {
              ieeeVerified: true,
              ieeeVerificationCompleted: true
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          // Mark ticket as verified successfully
          setVerifiedTickets(prev => new Map([
            ...prev, 
            [ticket._id, { status: 'success', message: 'Verified successfully', data: response.data }]
          ]));
          
          console.log(`✅ Verified ticket ${ticket._id}:`, response.data);
          
        } catch (ticketError) {
          console.error(`❌ Failed to verify ticket ${ticket._id}:`, ticketError);
          
          // Mark ticket as failed
          setVerifiedTickets(prev => new Map([
            ...prev, 
            [ticket._id, { 
              status: 'error', 
              message: ticketError.response?.data?.message || ticketError.message,
              error: ticketError.response?.data || ticketError.message
            }]
          ]));
        } finally {
          // Remove from verifying set
          setVerifyingTickets(prev => {
            const newSet = new Set(prev);
            newSet.delete(ticket._id);
            return newSet;
          });
        }
        
        // Update progress
        const progress = Math.round(((i + 1) / ticketsToVerify.length) * 100);
        setVerificationProgress(progress);
        
        // Small delay between requests to avoid overwhelming server
        if (i < ticketsToVerify.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      const successCount = Array.from(verifiedTickets.values()).filter(result => result.status === 'success').length;
      const errorCount = Array.from(verifiedTickets.values()).filter(result => result.status === 'error').length;
      
      setSuccess(`Verification completed! ${successCount} tickets verified successfully, ${errorCount} failed.`);
      
    } catch (error) {
      console.error('❌ Error during verification:', error);
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
              <span className="font-medium">Back to Ticket Details</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white">Bulk IEEE Verification</h1>
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
                <ul className="text-sm text-gray-300 space-y-2 nunito-sans-body">
                  <li>• Upload a CSV file with IEEE membership data</li>
                  <li>• Required columns: ieee_number, first_name, last_name</li>
                  <li>• Optional column: institution</li>
                  <li>• System will verify against registered tickets</li>
                  <li>• Data will be automatically processed after upload</li>
                </ul>
              </div>

              {/* Template Download */}
              <div className="mb-6">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                      <p className="text-green-400 font-semibold mb-2">
                        File Selected: {selectedFile.name}
                      </p>
                      <p className="text-gray-300">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={clearFile}
                        className="mt-2 text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-300 mb-2">
                        Drag and drop your IEEE data file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports CSV, Excel files
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}
            </div>

            {/* Right Column - Data Display and Processing */}
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 flex flex-col border border-gray-700 min-h-[calc(100vh-180px)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white font-nunito">
                  {verificationResults ? 'Match Results' : 'IEEE Data Preview'}
                </h2>
              </div>

              <div className="flex-1 min-h-0">
                {(isUploading || isProcessing) ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-4"></div>
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">
                          {uploadProgress < 40 ? 'Fetching unverified tickets...' :
                           uploadProgress < 60 ? 'Reading CSV file...' :
                           uploadProgress < 80 ? 'Matching IEEE numbers...' :
                           uploadProgress < 100 ? 'Processing results...' :
                           'Finalizing...'}
                        </span>
                        <span className="text-blue-400">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      {isProcessing && (
                        <p className="text-sm text-blue-400 mt-2 text-center">
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
                      <h3 className="text-lg font-semibold text-white mb-4 font-nunito text-center">Match Statistics</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div 
                          className={`p-3 bg-blue-500/10 rounded-lg border cursor-pointer transition-all hover:bg-blue-500/20 ${
                            selectedCategory === 'all' ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-blue-500/20'
                          }`}
                          onClick={() => setSelectedCategory('all')}
                        >
                          <div className="text-2xl font-bold text-blue-400">
                            {verificationResults.allTickets ? 
                              verificationResults.allTickets.filter(t => !excludedTickets.has(t.ieeeMembershipNumber)).length : 0}
                          </div>
                          <div className="text-xs text-gray-400">All Tickets</div>
                        </div>
                        <div 
                          className={`p-3 bg-green-500/10 rounded-lg border cursor-pointer transition-all hover:bg-green-500/20 ${
                            selectedCategory === 'matched' ? 'border-green-400 ring-2 ring-green-400/50' : 'border-green-500/20'
                          }`}
                          onClick={() => setSelectedCategory('matched')}
                        >
                          <div className="text-2xl font-bold text-green-400">
                            {verificationResults.allTickets ? 
                              verificationResults.allTickets.filter(t => t.status === 'matched' && !excludedTickets.has(t.ieeeMembershipNumber)).length : 0}
                          </div>
                          <div className="text-xs text-gray-400">Matched</div>
                        </div>
                        <div 
                          className={`p-3 bg-red-500/10 rounded-lg border cursor-pointer transition-all hover:bg-red-500/20 ${
                            selectedCategory === 'notMatched' ? 'border-red-400 ring-2 ring-red-400/50' : 'border-red-500/20'
                          }`}
                          onClick={() => setSelectedCategory('notMatched')}
                        >
                          <div className="text-2xl font-bold text-red-400">
                            {verificationResults.allTickets ? 
                              verificationResults.allTickets.filter(t => t.status === 'not_matched' && !excludedTickets.has(t.ieeeMembershipNumber)).length : 0}
                          </div>
                          <div className="text-xs text-gray-400">Not Matched</div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Progress */}
                    {isVerifying && (
                      <div className="mb-4 p-3 bg-[#2a2a2c] rounded-lg border border-gray-600">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">
                            Verifying IEEE memberships... 
                            {verificationProgress > 0 && verificationResults?.allTickets && (
                              <span className="text-blue-400 ml-2">
                                Processing ticket {Math.ceil((verificationProgress / 100) * verificationResults.allTickets.filter(t => t.status === 'matched' && !excludedTickets.has(t.ieeeMembershipNumber)).length)} of {verificationResults.allTickets.filter(t => t.status === 'matched' && !excludedTickets.has(t.ieeeMembershipNumber)).length}
                              </span>
                            )}
                          </span>
                          <span className="text-green-400">{verificationProgress}%</span>
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
                        {verificationResults.allTickets && verificationResults.allTickets
                          .filter(ticket => {
                            // First filter by excluded tickets
                            if (excludedTickets.has(ticket.ieeeMembershipNumber)) return false;
                            
                            // Then filter by category
                            if (selectedCategory === 'all') return true;
                            if (selectedCategory === 'matched') return ticket.status === 'matched';
                            if (selectedCategory === 'notMatched') return ticket.status === 'not_matched';
                            return false;
                          })
                          .map((ticket, index) => (
                          <div
                            key={ticket._id || index}
                            className={`p-4 rounded-lg border-l-4 transition-all duration-300 relative ${
                              ticket.status === 'matched' 
                                ? 'bg-green-500/10 border-green-400' 
                                : 'bg-red-500/10 border-red-400'
                            } ${verifyingTickets.has(ticket._id) ? 'opacity-75' : ''}`}
                          >
                            {/* Loading overlay for ticket being verified */}
                            {verifyingTickets.has(ticket._id) && (
                              <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                  Verifying...
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {(() => {
                                  const verificationResult = verifiedTickets.get(ticket._id);
                                  if (verificationResult) {
                                    return verificationResult.status === 'success' ? (
                                      <FiCheck className="text-green-400 text-lg" />
                                    ) : (
                                      <FiX className="text-red-400 text-lg" />
                                    );
                                  }
                                  return ticket.status === 'matched' ? (
                                    <FiCheck className="text-green-400 text-lg" />
                                  ) : (
                                    <FiX className="text-red-400 text-lg" />
                                  );
                                })()}
                                <div>
                                  <div className="font-semibold text-white nunito-sans-body">
                                    IEEE #{ticket.ieeeMembershipNumber}
                                  </div>
                                  <div className="text-sm text-gray-400 nunito-sans-body">
                                    <div>Email: {ticket.email}</div>
                                    {ticket.college && <div>College: {ticket.college}</div>}
                                    
                                    {/* Verification Result Display */}
                                    {(() => {
                                      const verificationResult = verifiedTickets.get(ticket._id);
                                      if (verificationResult) {
                                        return (
                                          <div className={`mt-2 p-2 rounded border ${
                                            verificationResult.status === 'success' 
                                              ? 'bg-green-500/10 border-green-500/20' 
                                              : 'bg-red-500/10 border-red-500/20'
                                          }`}>
                                            <div className={`font-semibold ${
                                              verificationResult.status === 'success' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                              {verificationResult.status === 'success' ? '✅ Verification Complete' : '❌ Verification Failed'}
                                            </div>
                                            <div className="text-xs text-gray-300 mt-1">
                                              {verificationResult.message}
                                            </div>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                    
                                    {ticket.status === 'matched' && ticket.csvData && !verifiedTickets.has(ticket._id) && (
                                      <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                                        <div className="text-blue-400 font-semibold">CSV Match Found:</div>
                                        {(() => {
                                          // Compare names to see if they match
                                          const ticketName = ticket.fullName?.toLowerCase().trim() || '';
                                          const csvName = `${ticket.csvData.firstName} ${ticket.csvData.lastName}`.toLowerCase().trim();
                                          
                                          // Check if names are similar (exact match or one contains the other)
                                          const namesMatch = ticketName === csvName || 
                                                           ticketName.includes(csvName) || 
                                                           csvName.includes(ticketName);
                                          
                                          if (namesMatch) {
                                            // Names match, show only CSV name
                                            return (
                                              <>
                                                <div>Name: {ticket.csvData.firstName} {ticket.csvData.lastName}</div>
                                                {ticket.csvData.institution && <div>Institution: {ticket.csvData.institution}</div>}
                                              </>
                                            );
                                          } else {
                                            // Names don't match, show both
                                            return (
                                              <>
                                                <div>CSV Name: {ticket.csvData.firstName} {ticket.csvData.lastName}</div>
                                                <div>Ticket Name: {ticket.fullName}</div>
                                                {ticket.csvData.institution && <div>Institution: {ticket.csvData.institution}</div>}
                                                <div className="text-yellow-400 text-xs mt-1">⚠️ Name mismatch detected</div>
                                              </>
                                            );
                                          }
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Delete Button - Only show for matched tickets that haven't been verified */}
                                {ticket.status === 'matched' && !verifiedTickets.has(ticket._id) && (
                                  <button
                                    onClick={() => handleRemoveTicket(ticket.ieeeMembershipNumber)}
                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                    title="Remove from verification list"
                                    disabled={verifyingTickets.has(ticket._id)}
                                  >
                                    <FiTrash2 className="text-sm" />
                                  </button>
                                )}
                                <div className={`text-sm ${
                                  (() => {
                                    const verificationResult = verifiedTickets.get(ticket._id);
                                    if (verificationResult) {
                                      return verificationResult.status === 'success' ? 'text-green-400' : 'text-red-400';
                                    }
                                    return ticket.status === 'matched' ? 'text-green-400' : 'text-red-400';
                                  })()
                                }`}>
                                  {(() => {
                                    const verificationResult = verifiedTickets.get(ticket._id);
                                    if (verificationResult) {
                                      return verificationResult.status === 'success' ? 'VERIFIED' : 'FAILED';
                                    }
                                    return ticket.status === 'matched' ? 'MATCHED' : 'NOT MATCHED';
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {verificationResults.allTickets && verificationResults.allTickets
                          .filter(ticket => {
                            // First filter by excluded tickets
                            if (excludedTickets.has(ticket.ieeeMembershipNumber)) return false;
                            
                            // Then filter by category
                            if (selectedCategory === 'all') return true;
                            if (selectedCategory === 'matched') return ticket.status === 'matched';
                            if (selectedCategory === 'notMatched') return ticket.status === 'not_matched';
                            return false;
                          }).length === 0 && (
                          <div className="text-center py-8">
                            <FiX className="mx-auto text-4xl text-gray-500 mb-3 opacity-50" />
                            <p className="text-gray-400">
                              No {selectedCategory === 'matched' ? 'matched tickets' : 
                                  selectedCategory === 'notMatched' ? 'unmatched tickets' : 'tickets'} found
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {selectedCategory === 'matched' ? 'No IEEE numbers from the CSV matched with unverified tickets' :
                               selectedCategory === 'notMatched' ? 'All tickets have matching IEEE numbers in the CSV' :
                               'No tickets available to display'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verify Button - Only show for matched tickets */}
                    {(() => {
                      const currentMatchedCount = verificationResults.allTickets ? 
                        verificationResults.allTickets.filter(t => t.status === 'matched' && !excludedTickets.has(t.ieeeMembershipNumber)).length : 0;
                      
                      return selectedCategory === 'matched' && currentMatchedCount > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <button
                            onClick={handleVerifyMatches}
                            disabled={isVerifying}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                              isVerifying
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {isVerifying 
                              ? `Verifying... (${verificationProgress}%)` 
                              : `Verify ${currentMatchedCount} Matched Tickets`
                            }
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                ) : selectedFile ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <FiBarChart2 className="mx-auto text-4xl mb-4 opacity-50" />
                      <p className="font-nunito">Processing file automatically...</p>
                      <p className="text-sm font-nunito mt-2">File will be processed upon upload</p>
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
