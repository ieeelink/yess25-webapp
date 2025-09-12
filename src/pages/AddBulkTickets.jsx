import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiDownload, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function AddBulkTickets() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadResults, setUploadResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvLoading, setCsvLoading] = useState(false);
  const [insertionStatus, setInsertionStatus] = useState([]);
  const [currentProcessing, setCurrentProcessing] = useState(-1);
  
  // SSE state management
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const [processingStats, setProcessingStats] = useState({
    total: 0,
    completed: 0,
    successful: 0,
    failed: 0,
    currentBatch: 0,
    totalBatches: 0
  });
  const [ticketProgress, setTicketProgress] = useState(new Map());
  const [processingPhase, setProcessingPhase] = useState('idle'); // idle, started, processing, completed
  
  const navigate = useNavigate();

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
  `;

  const handleFileSelect = (file) => {
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setError('');
      // Automatically read and parse the CSV file
      readCsvFile(file);
    } else {
      setError('Please select a valid CSV file.');
      setSelectedFile(null);
      setCsvData([]);
    }
  };

  const readCsvFile = async (file) => {
    setCsvLoading(true);
    setError('');
    
    try {
      const csvText = await file.text();
      const lines = csvText.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setError('CSV file must contain at least a header row and one data row.');
        setCsvLoading(false);
        setCsvData([]);
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row = { id: index + 1 };
        
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        
        return row;
      });
      
      setCsvData(data);
    } catch (err) {
      setError('Failed to parse CSV file. Please check the format.');
      setCsvData([]);
    } finally {
      setCsvLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      'fullName,gender,email,phone,institution,course,foodPreference,yearOfStudy,isIEEEMember,ieeeMembershipNumber',
      'John Doe,male,john@example.com,9876543210,NIT Calicut,Computer Science,veg,2,yes,12345678',
      'Jane Smith,female,jane@example.com,9876543211,IIT Madras,Electronics,non-veg,3,no,',
      'Alex Johnson,other,alex@example.com,9876543212,Other Institution,Mechanical,veg,1,gsm,87654321'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_tickets_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // SSE Event Handlers
  const setupSSEEventHandlers = (eventSource) => {
    // 🚀 Start Event
    eventSource.addEventListener('start', (event) => {
      const data = JSON.parse(event.data);
      setProcessingPhase('processing');
      setProcessingStats(prev => ({
        ...prev,
        total: data.totalTickets
      }));
      setSuccess(`Bulk processing started for ${data.totalTickets} tickets`);
    });

    // ⚡ Processing Event (Three Stages)
    eventSource.addEventListener('processing', (event) => {
      const data = JSON.parse(event.data);
      setCurrentProcessing(data.index - 1);
      
      // Update individual ticket progress
      setTicketProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(data.email, {
          email: data.email,
          index: data.index,
          status: data.status,
          ticketId: data.ticketId || null,
          timestamp: data.timestamp
        });
        return newMap;
      });
    });

    // ✅ Success Event
    eventSource.addEventListener('success', (event) => {
      const data = JSON.parse(event.data);
      
      // Update ticket progress
      setTicketProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(data.email, {
          email: data.email,
          index: data.index,
          status: 'completed',
          ticketId: data.ticketId,
          registrationId: data.registrationId,
          emailSent: data.emailSent,
          emailError: data.emailError || null,
          timestamp: data.timestamp
        });
        return newMap;
      });

      // Update insertion status for UI
      setInsertionStatus(prev => {
        const newStatus = [...prev];
        const existingIndex = newStatus.findIndex(item => item.email === data.email);
        
        const ticketStatus = {
          id: data.index,
          name: csvData[data.index - 1]?.fullName || 'Unknown',
          email: data.email,
          status: 'success',
          message: data.emailSent ? 'Ticket created and email sent' : `Ticket created, email failed: ${data.emailError}`,
          ticketId: data.ticketId,
          emailSent: data.emailSent
        };

        if (existingIndex >= 0) {
          newStatus[existingIndex] = ticketStatus;
        } else {
          newStatus.push(ticketStatus);
        }
        
        return newStatus;
      });

      // Update processing stats
      setProcessingStats(prev => ({
        ...prev,
        completed: prev.completed + 1,
        successful: prev.successful + 1
      }));
    });

    // ❌ Error Event
    eventSource.addEventListener('error', (event) => {
      const data = JSON.parse(event.data);
      
      if (data.email) {
        // Individual ticket error
        setTicketProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(data.email, {
            email: data.email,
            index: data.index,
            status: 'failed',
            error: data.error,
            timestamp: data.timestamp
          });
          return newMap;
        });

        // Update insertion status for UI
        setInsertionStatus(prev => {
          const newStatus = [...prev];
          const existingIndex = newStatus.findIndex(item => item.email === data.email);
          
          const ticketStatus = {
            id: data.index,
            name: csvData[data.index - 1]?.fullName || 'Unknown',
            email: data.email,
            status: 'failed',
            message: data.error
          };

          if (existingIndex >= 0) {
            newStatus[existingIndex] = ticketStatus;
          } else {
            newStatus.push(ticketStatus);
          }
          
          return newStatus;
        });

        // Update processing stats
        setProcessingStats(prev => ({
          ...prev,
          completed: prev.completed + 1,
          failed: prev.failed + 1
        }));
      } else {
        // Global error
        setError(data.message || 'Bulk processing failed');
        setIsProcessing(false);
        setProcessingPhase('idle');
        eventSource.close();
        setEventSource(null);
      }
    });

    // 📦 Batch Event
    eventSource.addEventListener('batch', (event) => {
      const data = JSON.parse(event.data);
      setProcessingStats(prev => ({
        ...prev,
        currentBatch: data.batchNumber,
        totalBatches: data.totalBatches,
        completed: data.completedTickets
      }));
    });

    // 🏁 Complete Event
    eventSource.addEventListener('complete', (event) => {
      const data = JSON.parse(event.data);
      setProcessingPhase('completed');
      setIsProcessing(false);
      setCurrentProcessing(-1);
      
      const { successful, failed } = processingStats;
      setSuccess(`Bulk processing completed! ${successful} successful, ${failed} failed out of ${data.totalTickets} tickets.`);
      
      setUploadResults({
        message: data.message,
        total: data.totalTickets,
        successful: successful,
        failed: failed
      });

      // Close SSE connection
      eventSource.close();
      setEventSource(null);
    });

    // Handle SSE connection errors
    eventSource.onerror = (error) => {
      setError('Connection lost. Please try again.');
      setIsProcessing(false);
      setProcessingPhase('idle');
      eventSource.close();
      setEventSource(null);
    };
  };

  // Cleanup SSE connection on component unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const handleInsertTickets = async () => {
    if (csvData.length === 0) {
      setError('No data to process');
      return;
    }

    // Reset states for new processing
    setInsertionStatus([]);
    setTicketProgress(new Map());
    setProcessingStats({
      total: csvData.length,
      completed: 0,
      successful: 0,
      failed: 0,
      currentBatch: 0,
      totalBatches: Math.ceil(csvData.length / 5)
    });
    setProcessingPhase('started');
    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required.');
        setIsProcessing(false);
        return;
      }

      // Start SSE connection for real-time updates
      const sseUrl = `${API_ENDPOINTS.ADMIN_ADD_BULK_TICKETS}?token=${encodeURIComponent(token)}`;
      const newEventSource = new EventSource(sseUrl);
      setEventSource(newEventSource);

      // Set up SSE event handlers
      setupSSEEventHandlers(newEventSource);

      // Send the CSV data to trigger processing
      const formData = new FormData();
      const csvHeaders = Object.keys(csvData[0]).filter(key => key !== 'id');
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => 
          csvHeaders.map(header => row[header] || '').join(',')
        )
      ].join('\n');
      
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      formData.append('csvFile', csvBlob, 'bulk_tickets.csv');

      // Send POST request to trigger SSE processing
      await axios.post(API_ENDPOINTS.ADMIN_ADD_BULK_TICKETS, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start bulk ticket processing');
      setIsProcessing(false);
      setProcessingPhase('idle');
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleInsertTickets();
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
          <h1 className="text-2xl font-bold text-white font-nunito">Add Bulk Tickets</h1>
          <div className="w-48"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Upload Section */}
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 flex flex-col border border-gray-700 h-fit max-h-[calc(100vh-200px)]">
              <h2 className="text-xl font-semibold text-white mb-6 font-nunito">Upload CSV File</h2>
              
              {/* Instructions */}
              <div className="mb-6 p-4 bg-[#2a2a2c] rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 font-nunito">Instructions:</h3>
                <ul className="text-sm text-gray-300 space-y-2 font-nunito">
                  <li>• Upload a CSV file with ticket data</li>
                  <li>• Required columns: fullName, email, phone, gender, institution, course, yearOfStudy</li>
                  <li>• Optional columns: foodPreference, isIEEEMember, ieeeMembershipNumber</li>
                  <li>• Data will be automatically displayed after upload</li>
                  <li>• Use the Insert Tickets button to process all tickets</li>
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
              <div className="mb-6">
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors h-48 flex flex-col justify-center ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                  
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="text-green-400 font-semibold mb-2 font-nunito">
                        File Selected: {selectedFile.name}
                      </p>
                      {csvLoading && (
                        <p className="text-blue-400 font-nunito">Parsing CSV...</p>
                      )}
                      {csvData.length > 0 && (
                        <p className="text-gray-300 font-nunito">
                          {csvData.length} records loaded
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-300 mb-2 font-nunito">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500 font-nunito">
                        Supports CSV files only
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
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 flex flex-col border border-gray-700 h-[calc(100vh-200px)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white font-nunito">
                  {isProcessing ? 'Real-time Processing' : insertionStatus.length > 0 ? 'Processing Results' : 'Ticket Data Preview'}
                </h2>
                {csvData.length > 0 && !isProcessing && insertionStatus.length === 0 && (
                  <button
                    onClick={handleInsertTickets}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-nunito"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiUpload className="text-lg" />
                        Insert Tickets
                      </>
                    )}
                  </button>
                )}
                
                {/* Stop Processing Button */}
                {isProcessing && (
                  <button
                    onClick={() => {
                      if (eventSource) {
                        eventSource.close();
                        setEventSource(null);
                      }
                      setIsProcessing(false);
                      setProcessingPhase('idle');
                      setError('Processing stopped by user');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-nunito"
                  >
                    <FiX className="text-lg" />
                    Stop Processing
                  </button>
                )}
              </div>

              <div className="flex-1 min-h-0">
                {csvLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="ml-3 text-gray-300 font-nunito">Loading CSV data...</span>
                  </div>
                ) : isProcessing ? (
                  /* Real-time Processing View */
                  <div className="h-full flex flex-col">
                    {/* Real-time Progress Overview */}
                    <div className="mb-4 p-4 bg-[#2a2a2c] rounded-lg border border-gray-600">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-4">
                        <div>
                          <div className="text-2xl font-bold text-white font-nunito">{processingStats.total}</div>
                          <div className="text-sm text-gray-400 font-nunito">Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400 font-nunito">{processingStats.completed}</div>
                          <div className="text-sm text-gray-400 font-nunito">Completed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400 font-nunito">{processingStats.successful}</div>
                          <div className="text-sm text-gray-400 font-nunito">Success</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400 font-nunito">{processingStats.failed}</div>
                          <div className="text-sm text-gray-400 font-nunito">Failed</div>
                        </div>
                      </div>
                      
                      {/* Overall Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out" 
                          style={{ width: `${processingStats.total > 0 ? (processingStats.completed / processingStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <div className="text-center text-sm text-gray-400 font-nunito">
                        {processingStats.completed} of {processingStats.total} tickets processed
                        {processingStats.totalBatches > 0 && (
                          <span className="ml-2">• Batch {processingStats.currentBatch}/{processingStats.totalBatches}</span>
                        )}
                      </div>
                    </div>

                    {/* Current Processing Indicator */}
                    {currentProcessing >= 0 && csvData[currentProcessing] && (
                      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                          <div>
                            <div className="font-semibold text-blue-400 font-nunito">
                              Currently Processing: {csvData[currentProcessing].fullName}
                            </div>
                            <div className="text-sm text-blue-300 font-nunito">
                              {csvData[currentProcessing].email}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Individual Ticket Progress */}
                    <div className="flex-1 overflow-auto custom-scrollbar">
                      <div className="space-y-3">
                        {Array.from(ticketProgress.values()).map((ticket) => {
                          const getStatusColor = (status) => {
                            switch (status) {
                              case 'validating': return 'border-yellow-400 bg-yellow-500/10';
                              case 'inserting': return 'border-blue-400 bg-blue-500/10';
                              case 'sending-email': return 'border-purple-400 bg-purple-500/10';
                              case 'completed': return 'border-green-400 bg-green-500/10';
                              case 'failed': return 'border-red-400 bg-red-500/10';
                              default: return 'border-gray-400 bg-gray-500/10';
                            }
                          };

                          const getStatusIcon = (status) => {
                            switch (status) {
                              case 'validating': return <div className="animate-pulse w-2 h-2 bg-yellow-400 rounded-full"></div>;
                              case 'inserting': return <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full"></div>;
                              case 'sending-email': return <div className="animate-pulse w-2 h-2 bg-purple-400 rounded-full"></div>;
                              case 'completed': return <FiCheck className="text-green-400 text-lg" />;
                              case 'failed': return <FiX className="text-red-400 text-lg" />;
                              default: return null;
                            }
                          };

                          const getStatusText = (status) => {
                            switch (status) {
                              case 'validating': return 'Validating data...';
                              case 'inserting': return 'Creating ticket...';
                              case 'sending-email': return 'Sending email...';
                              case 'completed': return ticket.emailSent ? 'Completed successfully' : `Completed (email failed: ${ticket.emailError})`;
                              case 'failed': return ticket.error || 'Processing failed';
                              default: return status;
                            }
                          };

                          return (
                            <div
                              key={ticket.email}
                              className={`p-4 rounded-lg border-l-4 ${getStatusColor(ticket.status)}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(ticket.status)}
                                  <div>
                                    <div className="font-semibold text-white font-nunito">
                                      {csvData[ticket.index - 1]?.fullName || 'Unknown'}
                                    </div>
                                    <div className="text-sm text-gray-400 font-nunito">
                                      {ticket.email}
                                    </div>
                                    {ticket.ticketId && (
                                      <div className="text-sm text-blue-400 font-nunito">
                                        ID: {ticket.ticketId}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-sm font-nunito ${
                                    ticket.status === 'completed' ? 'text-green-400' :
                                    ticket.status === 'failed' ? 'text-red-400' :
                                    'text-yellow-400'
                                  }`}>
                                    {getStatusText(ticket.status)}
                                  </div>
                                  <div className="text-xs text-gray-500 font-nunito">
                                    #{ticket.index} of {processingStats.total}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : insertionStatus.length > 0 ? (
                  /* Processing Results */
                  <div className="h-full flex flex-col">
                    {/* Results Summary */}
                    <div className="mb-4 p-4 bg-[#2a2a2c] rounded-lg border border-gray-600">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white font-nunito">{insertionStatus.length}</div>
                          <div className="text-sm text-gray-400 font-nunito">Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400 font-nunito">
                            {insertionStatus.filter(item => item.status === 'success').length}
                          </div>
                          <div className="text-sm text-gray-400 font-nunito">Success</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400 font-nunito">
                            {insertionStatus.filter(item => item.status === 'failed').length}
                          </div>
                          <div className="text-sm text-gray-400 font-nunito">Failed</div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="flex-1 overflow-auto custom-scrollbar">
                      <div className="space-y-3">
                        {insertionStatus.map((item, index) => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-lg border-l-4 ${
                              item.status === 'success'
                                ? 'bg-green-500/10 border-green-400'
                                : 'bg-red-500/10 border-red-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {item.status === 'success' ? (
                                  <FiCheck className="text-green-400 text-lg" />
                                ) : (
                                  <FiX className="text-red-400 text-lg" />
                                )}
                                <div>
                                  <div className="font-semibold text-white font-nunito">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-gray-400 font-nunito">
                                    {item.email}
                                  </div>
                                </div>
                              </div>
                              <div className={`text-sm font-nunito ${
                                item.status === 'success' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {item.message}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Results from API */}
                    {uploadResults && (
                      <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <h3 className="font-semibold text-blue-400 mb-2 font-nunito">Processing Summary:</h3>
                        <div className="text-sm text-blue-300 font-nunito">
                          {uploadResults.message && <p>{uploadResults.message}</p>}
                          {uploadResults.total && (
                            <p>Total Processed: {uploadResults.total}</p>
                          )}
                          {uploadResults.successful && (
                            <p>Successful: {uploadResults.successful}</p>
                          )}
                          {uploadResults.failed && (
                            <p>Failed: {uploadResults.failed}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : csvData.length > 0 ? (
                  /* CSV Data Preview */
                  <div className="h-full overflow-auto custom-scrollbar">
                    <div className="space-y-3">
                      {csvData.map((row, index) => (
                        <div key={index} className="p-4 bg-[#2a2a2c] rounded-lg border border-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <div className="font-semibold text-white font-nunito">
                                {row.fullName || row.name || 'No Name'}
                              </div>
                              <div className="text-sm text-gray-400 font-nunito">
                                {row.email || 'No Email'}
                              </div>
                            </div>
                            <div className="text-sm text-gray-400 font-nunito">
                              <div>Phone: {row.phone || 'N/A'}</div>
                              <div>Institution: {row.institution || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FiUpload className="mx-auto text-4xl mb-4 opacity-50" />
                      <p className="font-nunito">Upload a CSV file to see data preview</p>
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

export default AddBulkTickets;
