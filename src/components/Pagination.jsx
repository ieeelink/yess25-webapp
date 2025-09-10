import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalTickets, 
  hasNextPage, 
  hasPrevPage,
  onPageChange,
  onNext,
  onPrev,
  onFirst,
  onLast,
  limit,
  onLimitChange,
  loading = false
}) => {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startItem = totalTickets > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endItem = Math.min(currentPage * limit, totalTickets);

  if (totalTickets === 0) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-[#232326] border-t border-gray-800">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-400">No results found</p>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Per page:</label>
            <select
              value={limit}
              onChange={(e) => onLimitChange(parseInt(e.target.value))}
              className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
              disabled={loading}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 bg-[#232326] border-t border-gray-800 space-y-3 sm:space-y-0">
      {/* Results info and per page selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <p className="text-sm text-gray-300 nunito-sans-body">
          Showing <span className="font-medium text-white">{startItem.toLocaleString()}</span> to{' '}
          <span className="font-medium text-white">{endItem.toLocaleString()}</span> of{' '}
          <span className="font-medium text-white">{totalTickets.toLocaleString()}</span> results
        </p>

        {/* Items per page selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-300 nunito-sans-body">Per page:</label>
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="bg-[#18181b] text-gray-200 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#fe4a56] nunito-sans-body"
            disabled={loading}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* First page button */}
        <button
          onClick={onFirst}
          disabled={!hasPrevPage || loading}
          className={`px-2 py-2 text-sm font-medium rounded-md transition-colors nunito-sans-body ${ 
            hasPrevPage && !loading
              ? 'text-gray-300 bg-[#18181b] border border-gray-700 hover:bg-gray-700 hover:text-white'
              : 'text-gray-600 bg-gray-800 border border-gray-800 cursor-not-allowed'
          }`}
          title="First page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M21 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Previous button */}
        <button
          onClick={onPrev}
          disabled={!hasPrevPage || loading}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors nunito-sans-body ${
            hasPrevPage && !loading
              ? 'text-gray-300 bg-[#18181b] border border-gray-700 hover:bg-gray-700 hover:text-white'
              : 'text-gray-600 bg-gray-800 border border-gray-800 cursor-not-allowed'
          }`}
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center space-x-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors nunito-sans-body ${
                page === currentPage
                  ? 'text-white bg-[#fe4a56] border border-[#fe4a56]'
                  : loading
                  ? 'text-gray-600 bg-gray-800 border border-gray-800 cursor-not-allowed'
                  : 'text-gray-300 bg-[#18181b] border border-gray-700 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Mobile page info */}
        <div className="sm:hidden px-3 py-2 text-sm text-gray-300 bg-[#18181b] border border-gray-700 rounded-md nunito-sans-body">
          {currentPage} / {totalPages}
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={!hasNextPage || loading}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors nunito-sans-body ${
            hasNextPage && !loading
              ? 'text-gray-300 bg-[#18181b] border border-gray-700 hover:bg-gray-700 hover:text-white'
              : 'text-gray-600 bg-gray-800 border border-gray-800 cursor-not-allowed'
          }`}
        >
          Next
        </button>

        {/* Last page button */}
        <button
          onClick={onLast}
          disabled={!hasNextPage || loading}
          className={`px-2 py-2 text-sm font-medium rounded-md transition-colors nunito-sans-body ${
            hasNextPage && !loading
              ? 'text-gray-300 bg-[#18181b] border border-gray-700 hover:bg-gray-700 hover:text-white'
              : 'text-gray-600 bg-gray-800 border border-gray-800 cursor-not-allowed'
          }`}
          title="Last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M3 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
