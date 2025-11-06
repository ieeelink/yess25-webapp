import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiArrowLeft, FiCheck, FiX, FiUpload, FiFile, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

function MarkAttendance() {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [processingResults, setProcessingResults] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [statistics, setStatistics] = useState({ success: 0, error: 0, skipped: 0 });
  const [currentBatch, setCurrentBatch] = useState({ number: 0, total: 0 });
  const [showCompletionStats, setShowCompletionStats] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'success', 'skipped', 'error'
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const readerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setMessage({ type: 'error', text: 'Please upload a valid CSV file' });
      return;
    }

    setCsvFile(file);
    setMessage(null);
    setProcessingResults([]);
    parseCSV(file);
  };

  // Parse CSV file
  const parseCSV = (file) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          setMessage({ type: 'error', text: 'CSV file must contain at least a header row and one data row.' });
          setCsvFile(null);
          setLoading(false);
          return;
        }

        // Parse header and data
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.some(v => v)) { // Skip empty lines
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            data.push(row);
          }
        }

        setCsvData(data);
        setMessage({ type: 'success', text: `Successfully parsed ${data.length} entries from CSV` });
        setLoading(false);
      } catch (err) {
        console.error('CSV parsing error:', err);
        setMessage({ type: 'error', text: 'Failed to parse CSV file. Please check the file format.' });
        setCsvFile(null);
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Failed to read file' });
      setCsvFile(null);
      setLoading(false);
    };

    reader.readAsText(file);
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setCsvFile(null);
    setCsvData([]);
    setProcessingResults([]);
    setMessage(null);
    setProgress({ current: 0, total: 0 });
    setStatistics({ success: 0, error: 0, skipped: 0 });
    setCurrentBatch({ number: 0, total: 0 });
    setShowCompletionStats(false);
    setFilterType('all');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process attendance marking with SSE
  const handleMarkAttendance = async () => {
    if (!csvData.length) {
      setMessage({ type: 'error', text: 'No data to process. Please upload a valid CSV file.' });
      return;
    }

    setProcessing(true);
    setShowCompletionStats(false);
    setProcessingResults([]);
    setProgress({ current: 0, total: csvData.length });
    setStatistics({ success: 0, error: 0, skipped: 0 });
    setCurrentBatch({ number: 0, total: 0 });
    setMessage(null);
    setFilterType('all');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login again.' });
        setProcessing(false);
        return;
      }

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Send CSV data to server with SSE streaming (guests array with all check-in data)
      const response = await fetch(API_ENDPOINTS.ADMIN_MARK_ATTENDANCE_BULK, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ guests: csvData })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use text as is
          if (errorText) errorMessage = errorText;
        }
        
        throw new Error(errorMessage);
      }

      // Read the SSE stream
      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = '';

      const readStream = async () => {
        try {
          console.log('📡 Starting SSE stream reading...');
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('✅ Stream complete - All guests processed');
              
              // If processing flag is still true, ensure it's set to false
              setProcessing(false);
              break;
            }

            // Decode the chunk and add to buffer
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // Keep the last incomplete line in the buffer
            buffer = lines.pop() || '';

            let currentEvent = { type: '', data: null, id: '' };

            for (const line of lines) {
              if (line.startsWith('event:')) {
                currentEvent.type = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                try {
                  const jsonStr = line.slice(5).trim();
                  const parsedData = JSON.parse(jsonStr);
                  currentEvent.data = parsedData;
                  
                  // If event type not set via 'event:' line, try to get it from data
                  if (!currentEvent.type && parsedData.type) {
                    currentEvent.type = parsedData.type;
                  }
                } catch (err) {
                  console.error('Error parsing SSE data:', err, line);
                }
              } else if (line.startsWith('id:')) {
                currentEvent.id = line.slice(3).trim();
              } else if (line === '' || line === '\r') {
                // Empty line indicates end of event
                if (currentEvent.data) {
                  // Merge type and data, giving priority to explicit type from 'event:' line
                  const eventToHandle = currentEvent.type 
                    ? { type: currentEvent.type, ...currentEvent.data }
                    : currentEvent.data;
                  
                  // Log the event for debugging
                  console.log(`📨 SSE Event [${eventToHandle.type || 'unknown'}]:`, eventToHandle);
                  
                  handleSSEEvent(eventToHandle);
                  currentEvent = { type: '', data: null, id: '' };
                }
              }
            }
          }
        } catch (err) {
          console.error('Stream reading error:', err);
          setProcessing(false);
          if (processingResults.length === 0) {
            setMessage({ 
              type: 'error', 
              text: 'Connection error while reading stream.' 
            });
          }
        }
      };

      // Start reading the stream
      readStream();

    } catch (err) {
      console.error('Attendance marking error:', err);
      
      let errorMessage = 'Failed to process attendance';
      
      // Handle AbortError (when user cancels or navigates away)
      if (err.name === 'AbortError') {
        errorMessage = 'Request was cancelled';
      }
      // Handle fetch/network errors
      else if (err.message) {
        if (err.message.includes('401')) {
          errorMessage = 'Authentication failed. Please login again.';
          setTimeout(() => navigate('/admin'), 2000);
        } else if (err.message.includes('403')) {
          errorMessage = 'Not authorized to mark attendance';
        } else if (err.message.includes('404')) {
          errorMessage = 'Endpoint not found. Please check the API configuration.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.message.startsWith('HTTP')) {
          errorMessage = err.message;
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and ensure the backend is running.';
        } else {
          errorMessage = err.message;
        }
      }

      setMessage({ type: 'error', text: errorMessage });
      setProcessing(false);
    }
  };

  // Handle SSE events based on backend event structure
  const handleSSEEvent = (eventData) => {
    console.log('Received SSE event:', eventData);

    const eventType = eventData.type || eventData.event;

    switch (eventType) {
      case 'start':
        // Processing started
        setProgress({ current: 0, total: eventData.totalGuests || csvData.length });
        setMessage({ 
          type: 'success', 
          text: `Started processing ${eventData.totalGuests} guests...` 
        });
        break;

      case 'batch-start':
        // New batch started
        setCurrentBatch({ 
          number: eventData.batchNumber, 
          total: eventData.totalBatches 
        });
        console.log(`Starting batch ${eventData.batchNumber}/${eventData.totalBatches}`);
        break;

      case 'processing':
        // Individual guest being checked
        setProgress(prev => ({ 
          ...prev, 
          current: eventData.index 
        }));
        console.log(`Processing guest ${eventData.index}: ${eventData.email} - ${eventData.name}`);
        break;

      case 'success':
        // Attendance marked successfully
        setProgress(prev => ({ 
          ...prev, 
          current: eventData.index 
        }));
        setStatistics(prev => ({ ...prev, success: prev.success + 1 }));
        setProcessingResults(prev => [...prev, {
          type: 'success',
          success: true,
          email: eventData.email,
          name: eventData.guestName || eventData.name,
          phone: eventData.phone,
          checkInTime: eventData.checkInTime,
          checkInMethod: eventData.checkInMethod,
          message: 'Attendance marked successfully',
          details: eventData.message || `Marked via ${eventData.checkInMethod} at ${new Date(eventData.attendanceMarkedAt || eventData.checkInTime).toLocaleTimeString()}`,
          status: 'completed',
          index: eventData.index
        }]);
        break;

      case 'skipped':
        // Already marked
        setProgress(prev => ({ 
          ...prev, 
          current: eventData.index 
        }));
        setStatistics(prev => ({ ...prev, skipped: prev.skipped + 1 }));
        setProcessingResults(prev => [...prev, {
          type: 'skipped',
          success: false,
          email: eventData.email,
          name: eventData.guestName || eventData.name,
          phone: eventData.phone,
          checkInTime: eventData.checkInTime,
          checkInMethod: eventData.checkInMethod,
          message: 'Already marked',
          details: eventData.message || `Attendance was previously marked at ${eventData.previouslyMarkedAt ? new Date(eventData.previouslyMarkedAt).toLocaleString() : 'unknown time'}`,
          status: 'already-marked',
          index: eventData.index
        }]);
        break;

      case 'error':
        // Processing failed
        setProgress(prev => ({ 
          ...prev, 
          current: eventData.index 
        }));
        setStatistics(prev => ({ ...prev, error: prev.error + 1 }));
        setProcessingResults(prev => [...prev, {
          type: 'error',
          success: false,
          email: eventData.email,
          name: eventData.name,
          phone: eventData.phone,
          message: 'Failed to mark attendance',
          details: eventData.error || 'Unknown error occurred',
          status: 'failed',
          index: eventData.index
        }]);
        break;

      case 'batch-complete':
        // Batch completed
        console.log(`Batch ${eventData.batchNumber} completed: ${eventData.successCount} success, ${eventData.errorCount} errors, ${eventData.skippedCount} skipped`);
        break;

      case 'complete':
        // All processing complete
        setProcessing(false);
        setShowCompletionStats(true);
        setProgress(prev => ({ 
          ...prev, 
          current: eventData.totalGuests 
        }));
        setStatistics({
          success: eventData.successCount,
          error: eventData.errorCount,
          skipped: eventData.skippedCount
        });
        setMessage({ 
          type: 'success', 
          text: `Processing complete! ${eventData.successCount} successful, ${eventData.errorCount} failed, ${eventData.skippedCount} skipped.` 
        });
        
        break;

      default:
        console.log('Unknown event type:', eventType, eventData);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (readerRef.current) {
        readerRef.current.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#18181b] nunito-sans-body">
      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />

      {/* Header */}
      <div className="bg-[#1a1a1a] shadow-md border-b border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/tickets')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-medium">Back to Ticket Details</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Mark Guest Attendance (Bulk)
          </h1>
          <div className="w-48"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-81px)]">
        <div className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
            
            {/* Left Column - Upload Section */}
            <div className="flex flex-col h-full overflow-hidden p-6">
              <h2 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Upload Guest Check-In Data
              </h2>

              {/* Status Messages */}
              {message && (
                <div className={`mb-4 px-3 py-2 rounded-lg border text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-900/20 border-green-700 text-green-400' 
                    : 'bg-red-900/20 border-red-700 text-red-400'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.type === 'success' ? (
                      <FiCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <FiX className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="font-medium">{message.text}</p>
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div className="flex-1 min-h-0 overflow-hidden">
                {!csvFile ? (
                  <div
                    className="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors h-full flex flex-col justify-center border-gray-600 hover:border-gray-500"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                    <div className="text-center">
                      <p className="text-gray-300 mb-2">
                        Drag and drop your guest check-in file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports CSV files
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col overflow-hidden">
                    {/* Selected File Info */}
                    <div className="mb-4 bg-[#2a2a2c] border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FiFile className="w-8 h-8 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">{csvFile.name}</p>
                            <p className="text-gray-400 text-sm">{csvData.length} entries found</p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveFile}
                          disabled={processing}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Preview Data */}
                    {csvData.length > 0 && (
                      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          Preview (First 5 entries)
                        </h4>
                        <div className="space-y-2 pb-4">
                      {csvData.slice(0, 5).map((row, index) => (
                        <div key={index} className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500 text-xs">Name:</span>
                              <p className="text-white font-medium">{row.name || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Email:</span>
                              <p className="text-gray-300 truncate">{row.email || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Phone:</span>
                              <p className="text-gray-300">{row.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Check-In Method:</span>
                              <p className="text-gray-300">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  row.checkInMethod === 'QR' 
                                    ? 'bg-blue-900/40 text-blue-400 border border-blue-700' 
                                    : 'bg-purple-900/40 text-purple-400 border border-purple-700'
                                }`}>
                                  {row.checkInMethod || 'N/A'}
                                </span>
                              </p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500 text-xs">Check-In Time:</span>
                              <p className="text-gray-300 text-xs">
                                {row.checkInTime ? new Date(row.checkInTime).toLocaleString('en-US', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                }) : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                        </div>
                        {csvData.length > 5 && (
                          <p className="text-gray-500 text-xs mt-2">... and {csvData.length - 5} more entries</p>
                        )}
                      </div>
                    )}

                    {/* Process Button */}
                    <button
                      onClick={handleMarkAttendance}
                      disabled={loading || processing || csvData.length === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-4 ${
                        loading || processing || csvData.length === 0
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-[#fe4a56] hover:bg-[#8c0505] border border-[#fe4a56] hover:border-[#8c0505]'
                      }`}
                    >
                      {processing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing... ({progress.current}/{progress.total})
                        </>
                      ) : (
                        <>
                          <FiCheck className="w-5 h-5" />
                          Mark Attendance for {csvData.length} Entries
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Processing Results */}
            <div className="flex flex-col h-full overflow-hidden p-6 border-l border-gray-700">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {processingResults.length > 0 ? 'Processing Results' : 'Results Preview'}
                </h2>
              </div>

              <div className="flex-1 flex flex-col space-y-6 overflow-hidden min-h-0">
                {/* Statistics Summary (shown during and after processing) */}
                {(processing || showCompletionStats) && progress.total > 0 && (
                  <div className="bg-[#1a1a1d] rounded-lg p-6 border border-gray-700 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-4">
                      {showCompletionStats && !processing ? (
                        <>
                          <FiCheck className="w-6 h-6 text-green-400" />
                          <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            Processing Complete!
                          </h3>
                        </>
                      ) : (
                        <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          Processing Status
                        </h3>
                      )}
                    </div>

                    {/* Hint text */}
                    {processingResults.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3 italic">
                        💡 Click on any statistic below to filter results
                      </p>
                    )}
              
                    {/* Batch Info (only during processing) */}
                    {processing && currentBatch.total > 0 && (
                      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <p className="text-blue-400 font-medium">
                          Processing Batch {currentBatch.number} of {currentBatch.total}
                        </p>
                      </div>
                    )}

                    {/* Statistics Grid - Clickable */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <button
                        onClick={() => setFilterType(filterType === 'success' ? 'all' : 'success')}
                        className={`bg-green-900/20 border rounded-lg p-4 text-left transition-all duration-200 ${
                          filterType === 'success' 
                            ? 'border-green-400 ring-2 ring-green-400 shadow-lg' 
                            : 'border-green-700 hover:border-green-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FiCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-400 text-sm">Success</span>
                        </div>
                        <p className="text-2xl font-bold text-green-400">{statistics.success}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {progress.total > 0 ? Math.round((statistics.success / progress.total) * 100) : 0}% of total
                        </p>
                        {filterType === 'success' && (
                          <p className="text-xs text-green-400 mt-2 font-medium">✓ Showing filtered</p>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setFilterType(filterType === 'skipped' ? 'all' : 'skipped')}
                        className={`bg-yellow-900/20 border rounded-lg p-4 text-left transition-all duration-200 ${
                          filterType === 'skipped' 
                            ? 'border-yellow-400 ring-2 ring-yellow-400 shadow-lg' 
                            : 'border-yellow-700 hover:border-yellow-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FiAlertCircle className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-400 text-sm">Skipped</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-400">{statistics.skipped}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {progress.total > 0 ? Math.round((statistics.skipped / progress.total) * 100) : 0}% of total
                        </p>
                        {filterType === 'skipped' && (
                          <p className="text-xs text-yellow-400 mt-2 font-medium">✓ Showing filtered</p>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setFilterType(filterType === 'error' ? 'all' : 'error')}
                        className={`bg-red-900/20 border rounded-lg p-4 text-left transition-all duration-200 ${
                          filterType === 'error' 
                            ? 'border-red-400 ring-2 ring-red-400 shadow-lg' 
                            : 'border-red-700 hover:border-red-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FiX className="w-5 h-5 text-red-400" />
                          <span className="text-gray-400 text-sm">Failed</span>
                        </div>
                        <p className="text-2xl font-bold text-red-400">{statistics.error}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {progress.total > 0 ? Math.round((statistics.error / progress.total) * 100) : 0}% of total
                        </p>
                        {filterType === 'error' && (
                          <p className="text-xs text-red-400 mt-2 font-medium">✓ Showing filtered</p>
                        )}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Overall Progress</span>
                        <span className="text-gray-400">{progress.current} / {progress.total}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            showCompletionStats && !processing ? 'bg-green-500' : 'bg-[#fe4a56]'
                          }`}
                          style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400 text-xs">
                          {progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}% Complete
                        </span>
                        {processing && (
                          <span className="text-gray-400 text-xs">
                            {progress.total - progress.current} remaining
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

          {/* Processing Results */}
          {processingResults.length > 0 && (
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 border border-gray-700 flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    Processing Results
                  </h3>
                  {filterType !== 'all' && (
                    <p className="text-sm text-gray-400 mt-1">
                      Filtered: Showing only {filterType === 'success' ? 'successful' : filterType === 'skipped' ? 'skipped' : 'failed'} entries
                      <button 
                        onClick={() => setFilterType('all')}
                        className="ml-2 text-blue-400 hover:text-blue-300 underline"
                      >
                        Show all
                      </button>
                    </p>
                  )}
                </div>
                <div className="text-gray-400 text-sm">
                  Showing {processingResults.filter(r => filterType === 'all' || r.type === filterType).length} of {progress.total} entries
                </div>
              </div>
              <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                {processingResults
                  .filter(result => filterType === 'all' || result.type === filterType)
                  .length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <FiAlertCircle className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-base font-medium">No {filterType === 'all' ? '' : filterType} entries found</p>
                      {filterType !== 'all' && (
                        <button 
                          onClick={() => setFilterType('all')}
                          className="mt-2 text-blue-400 hover:text-blue-300 underline text-sm"
                        >
                          Show all results
                        </button>
                      )}
                    </div>
                  ) : (
                    processingResults
                      .filter(result => filterType === 'all' || result.type === filterType)
                      .map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.type === 'success'
                        ? 'bg-green-900/20 border-green-700' 
                        : result.type === 'skipped'
                        ? 'bg-yellow-900/20 border-yellow-700'
                        : 'bg-red-900/20 border-red-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.type === 'success' ? (
                        <FiCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : result.type === 'skipped' ? (
                        <FiAlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <FiX className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className={`font-semibold text-lg ${
                            result.type === 'success' 
                              ? 'text-green-400' 
                              : result.type === 'skipped'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}>
                            {result.name || 'Unknown Guest'}
                          </p>
                          <span className="text-xs text-gray-500">#{result.index}</span>
                        </div>
                        
                        {/* Guest Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                          {result.email && (
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <p className="text-gray-300 truncate">{result.email}</p>
                            </div>
                          )}
                          {result.phone && (
                            <div>
                              <span className="text-gray-500">Phone:</span>
                              <p className="text-gray-300">{result.phone}</p>
                            </div>
                          )}
                          {result.checkInMethod && (
                            <div>
                              <span className="text-gray-500">Method:</span>
                              <p className="text-gray-300">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  result.checkInMethod === 'QR' 
                                    ? 'bg-blue-900/40 text-blue-400 border border-blue-700' 
                                    : 'bg-purple-900/40 text-purple-400 border border-purple-700'
                                }`}>
                                  {result.checkInMethod}
                                </span>
                              </p>
                            </div>
                          )}
                          {result.checkInTime && (
                            <div>
                              <span className="text-gray-500">Check-In:</span>
                              <p className="text-gray-300">
                                {new Date(result.checkInTime).toLocaleString('en-US', {
                                  dateStyle: 'short',
                                  timeStyle: 'short'
                                })}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Status Message */}
                        <p className={`text-sm font-medium ${
                          result.type === 'success' 
                            ? 'text-green-300' 
                            : result.type === 'skipped'
                            ? 'text-yellow-300'
                            : 'text-red-300'
                        }`}>
                          {result.message}
                        </p>
                        {result.details && (
                          <p className="text-gray-400 text-xs mt-1">{result.details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                      ))
                  )}
                </div>
              </div>
            )}

                {/* Show placeholder when no results yet */}
                {!processing && processingResults.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <FiCheck className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No results yet</p>
                    <p className="text-sm">Upload a CSV file and click "Mark Attendance" to begin</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
    </div>
  );
}

export default MarkAttendance;
