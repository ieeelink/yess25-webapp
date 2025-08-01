import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiDownload, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function WebhookResolve() {
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
      'Submitted On,Full name,Email address,Phone number,Gender,Year of study,Enter your year of study,College/Institution,College Name,Course/Stream,Course/Stream Name,Food Preferences,Membership Status,Price,IEEE Membership Id,"I agree to terms & conditions",Payment Details',
      '28-07-2025,John Doe,john@example.com,(+91) 9876543210,Male,Second Year,,NIT Calicut,,Computer Science and Allied courses,,Veg,IEEE Member,400,100123456,Agreed,pay_example123',
      '29-07-2025,Jane Smith,jane@example.com,(+91) 9876543211,Female,Third Year,,IIT Madras,,Electronics and Allied courses,,Non-Veg,Non IEEE Member,800,,Agreed,pay_example456',
      '30-07-2025,Alex Johnson,alex@example.com,(+91) 9876543212,Other,First Year,,Other Institution,,Mechanical and Allied courses,,Veg,Graduate Student Member,600,100987654,Agreed,pay_example789'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webhook_resolver_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (csvData.length === 0) {
      setError('Please select a CSV file with valid data to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setUploadResults(null);
    setInsertionStatus([]);
    setCurrentProcessing(0);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required.');
        setLoading(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const results = [];
      const statusArray = [];
      
      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        setCurrentProcessing(i);
        
        // Add current ticket to status array as "processing"
        statusArray.push({
          index: i,
          name: row['Full name'] || row.fullName || 'Unknown',
          email: row['Email address'] || row.email || 'No email',
          status: 'processing'
        });
        setInsertionStatus([...statusArray]);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Format data to match webhook structure (nested under webhook.answers)
          const webhookData = {
            webhook: {
              answers: {
                fullName: { 
                  value: row['Full name'] || row.fullName || '', 
                  field: 'Full name', 
                  type: 'full_name' 
                },
                email: { 
                  value: row['Email address'] || row.email || '', 
                  field: 'Email address', 
                  type: 'email' 
                },
                phone: { 
                  value: row['Phone number'] || row.phone || '', 
                  field: 'Phone number', 
                  type: 'phone' 
                },
                gender: { 
                  value: [row['Gender'] || row.gender || ''], 
                  field: 'Gender', 
                  type: 'single_choice' 
                },
                yearOfStudy: { 
                  value: [row['Year of study'] || row['Enter your year of study'] || row.yearOfStudy || ''], 
                  field: 'Year of study', 
                  type: 'dropdown' 
                },
                institution: { 
                  value: [row['College/Institution'] || row['College Name'] || row.institution || ''], 
                  field: 'College/Institution', 
                  type: 'dropdown' 
                },
                course: { 
                  value: [row['Course/Stream'] || row['Course/Stream Name'] || row.course || ''], 
                  field: 'Course/Stream', 
                  type: 'dropdown' 
                },
                foodPreference: { 
                  value: [row['Food Preferences'] || row.foodPreference || ''], 
                  field: 'Food Preferences', 
                  type: 'single_choice' 
                },
                isIEEEMember: { 
                  value: [row['Membership Status'] || row.isIEEEMember || ''], 
                  field: 'Membership Status', 
                  type: 'single_choice' 
                },
                calculated_field: { 
                  value: row['Price'] || row.calculatedField || '', 
                  field: 'Price', 
                  type: 'calculated_field' 
                },
                ieeeMembershipNumber: {
                  value: row['IEEE Membership Id'] || row.ieeeMembershipNumber || '',
                  field: 'IEEE Membership Id',
                  type: 'text_input'
                },
                terms_and_condition: { 
                  value: 'Agreed', 
                  field: 'I agree to terms & conditions. Please check our privacy policy.', 
                  type: 'terms_and_condition' 
                },
                razorpay_payment: {
                  value: { 
                    razorpay_payment: [
                      {
                        label: 'Amount',
                        content: `${row['Price'] || row.calculatedField || '0'}.00 INR`,
                        key: 'amount_with_currency'
                      },
                      {
                        label: 'Transaction ID',
                        content: row['Payment Details'] || row.razorpayPaymentId || '',
                        key: 'identifier'
                      }
                    ]
                  },
                  field: 'Payment Details',
                  type: 'razorpay_payment'
                }
              }
            }
          };
          
          // Use actual API call
          await axios.post(API_ENDPOINTS.ADMIN_WEBHOOK_RESOLVE, webhookData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          successCount++;
          results.push({ 
            name: row['Full name'] || row.fullName || 'Unknown',
            email: row['Email address'] || row.email || 'No email',
            status: 'success' 
          });
          
          // Update status to success
          statusArray[i] = {
            ...statusArray[i],
            status: 'success'
          };
          
        } catch (err) {
          console.error('Error processing row:', err);
          errorCount++;
          results.push({ 
            name: row['Full name'] || row.fullName || 'Unknown',
            email: row['Email address'] || row.email || 'No email',
            status: 'error',
            error: err.response?.data?.message || err.message || 'Processing failed'
          });
          
          // Update status to error
          statusArray[i] = {
            ...statusArray[i],
            status: 'error',
            error: err.response?.data?.message || err.message || 'Processing failed'
          };
        }
        
        setInsertionStatus([...statusArray]);
      }
      
      setCurrentProcessing(-1);
      setUploadResults({
        total: csvData.length,
        successful: successCount,
        failed: errorCount,
        details: results
      });
      
      if (errorCount === 0) {
        setSuccess(`Successfully processed all ${successCount} webhook records!`);
      } else {
        setError(`Processed ${successCount} records successfully, ${errorCount} failed.`);
      }
      
      setSelectedFile(null);
      setCsvData([]);
      
    } catch (err) {
      setError('Failed to process CSV file. Please try again.');
      console.error('Error processing webhook data:', err);
    } finally {
      setLoading(false);
      setCurrentProcessing(-1);
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
          <h1 className="text-2xl font-bold text-white font-nunito">Webhook Resolver</h1>
          <div className="w-48"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
            
            {/* Left Column - Upload Section */}
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 flex flex-col border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 font-nunito">Upload CSV File</h2>
              
              {/* Instructions */}
              <div className="mb-6 p-4 bg-[#2a2a2c] rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 font-nunito">Instructions:</h3>
                <ul className="text-sm text-gray-300 space-y-2 font-nunito">
                  <li>• Upload a CSV file to resolve missing webhook data</li>
                  <li>• Required: Full name, Email, Phone, Gender, Year of study, Institution, Course, Food Preferences, Membership Status, Price</li>
                  <li>• Payment field must contain Razorpay payment ID</li>
                  <li>• Data will be automatically displayed after upload</li>
                  <li>• Use Insert Tickets to process each ticket individually</li>
                  <li className="text-yellow-400">⚠️ Use only when webhook data was not received properly</li>
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
            <div className="bg-[#232326] rounded-xl shadow-lg p-6 flex flex-col border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white font-nunito">
                  {insertionStatus.length > 0 ? 'Processing Results' : 'Webhook Data Preview'}
                </h2>
                {csvData.length > 0 && insertionStatus.length === 0 && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-nunito"
                  >
                    {loading ? (
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
              </div>

              <div className="flex-1 min-h-0">
                {csvLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="ml-3 text-gray-300 font-nunito">Loading CSV data...</span>
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
                            {insertionStatus.filter(item => item.status === 'error').length}
                          </div>
                          <div className="text-sm text-gray-400 font-nunito">Failed</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {currentProcessing >= 0 && (
                      <div className="mb-4 p-3 bg-[#2a2a2c] rounded-lg border border-gray-600">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300 font-nunito">
                            Processing ticket {currentProcessing + 1} of {csvData.length}
                          </span>
                          <span className="text-blue-400 font-nunito">
                            {Math.round(((currentProcessing + 1) / csvData.length) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentProcessing + 1) / csvData.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Detailed Results */}
                    <div className="flex-1 overflow-auto custom-scrollbar">
                      <div className="space-y-3">
                        {insertionStatus.map((item, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-l-4 ${
                              item.status === 'success'
                                ? 'bg-green-500/10 border-green-400'
                                : item.status === 'error'
                                ? 'bg-red-500/10 border-red-400'
                                : 'bg-blue-500/10 border-blue-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {item.status === 'success' ? (
                                  <FiCheck className="text-green-400 text-lg" />
                                ) : item.status === 'error' ? (
                                  <FiX className="text-red-400 text-lg" />
                                ) : (
                                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                )}
                                <div>
                                  <div className="font-semibold text-white font-nunito">
                                    Ticket #{index + 1} - {item.name}
                                  </div>
                                  <div className="text-sm text-gray-400 font-nunito">
                                    {item.email}
                                  </div>
                                  {item.error && (
                                    <div className="text-sm text-red-400 mt-1 font-nunito">
                                      Error: {item.error}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {currentProcessing === index && (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                              )}
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
                          <p>Total Processed: {uploadResults.total}</p>
                          <p>Successful: {uploadResults.successful}</p>
                          <p>Failed: {uploadResults.failed}</p>
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
                                {row['Full name'] || row.fullName || 'No Name'}
                              </div>
                              <div className="text-sm text-gray-400 font-nunito">
                                {row['Email address'] || row.email || 'No Email'}
                              </div>
                            </div>
                            <div className="text-sm text-gray-400 font-nunito">
                              <div>Phone: {row['Phone number'] || row.phone || 'N/A'}</div>
                              <div>Institution: {row['College/Institution'] || row.institution || 'N/A'}</div>
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
                      <p className="font-nunito">Upload a CSV file to see webhook data preview</p>
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

export default WebhookResolve;
