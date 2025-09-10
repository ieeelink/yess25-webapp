import React from 'react';

const TicketSummary = ({ summary, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount / 100); // Convert paisa to rupees
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const StatItem = ({ title, value, color = "blue" }) => {
    const colorClasses = {
      blue: "text-blue-300",
      green: "text-green-300",
      yellow: "text-yellow-300",
      red: "text-red-300",
      purple: "text-purple-300",
      indigo: "text-indigo-300"
    };

    return (
      <div className="flex flex-col items-center text-center">
        <p className={`text-lg font-bold ${colorClasses[color]} nunito-sans-body`}>
          {loading ? (
            <span className="inline-block w-12 h-5 bg-gray-700 rounded animate-pulse"></span>
          ) : (
            value
          )}
        </p>
        <p className="text-xs text-gray-400 nunito-sans-body mt-0.5">{title}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-8 py-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="h-5 w-12 bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-16 bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 py-4 px-4 flex-wrap">
      <StatItem
        title="Total Revenue"
        value={formatCurrency(summary.totalRevenue)}
        color="green"
      />

      <StatItem
        title="Paid Tickets"
        value={formatNumber(summary.paidCount)}
        color="green"
      />

      <StatItem
        title="Pending"
        value={formatNumber(summary.pendingCount)}
        color="yellow"
      />

      <StatItem
        title="Failed"
        value={formatNumber(summary.failedCount)}
        color="red"
      />

      <StatItem
        title="IEEE Members"
        value={formatNumber(summary.ieeeMembers)}
        color="blue"
      />

      <StatItem
        title="Non-IEEE / GSM"
        value={formatNumber(summary.nonIeeeMembers + summary.gsmMembers)}
        color="purple"
      />
    </div>
  );
};

export default TicketSummary;
