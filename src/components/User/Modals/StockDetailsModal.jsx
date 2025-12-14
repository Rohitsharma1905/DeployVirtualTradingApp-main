import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import CompanyDetailModal from "../../Admin/Modals/companyDetailModal/index";
import toast from 'react-hot-toast';

const PORTAL_FEE = 25;

const StockDetailsModal = ({ stock, onClose }) => {
  const user = useSelector(state => state.user.auth?.user || {});
  const activeSubscription = useSelector(state => 
    state.user.subscriptionPlan?.userSubscriptions?.find(sub => 
      sub.status === 'Active' && !sub.isDeleted
    )
  );
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const stockStats = useMemo(() => {
    if (!stock || !stock.transactions) return {
      totalShares: 0,
      averagePrice: 0,
      totalInvestment: 0,
      buyTransactions: 0,
      sellTransactions: 0,
      realizedPL: 0,
      unrealizedPL: 0,
      totalFeesPaid: 0,
      netInvestment: 0
    };

    const buyTransactions = stock.transactions.filter(t => t.type === 'buy');
    const sellTransactions = stock.transactions.filter(t => t.type === 'sell');

    const totalFeesPaid = stock.transactions.length * PORTAL_FEE;
    const totalInvestment = buyTransactions.reduce((total, t) => 
      total + (t.price * t.numberOfShares), 0);
    const netInvestment = totalInvestment + (buyTransactions.length * PORTAL_FEE);

    const realizedPL = sellTransactions.reduce((total, sell) => {
      const correspondingBuy = buyTransactions.find(buy => 
        buy.companySymbol === sell.companySymbol
      );
      
      if (correspondingBuy) {
        const profitLoss = (
          (sell.price * sell.numberOfShares) - 
          (correspondingBuy.price * sell.numberOfShares) - 
          PORTAL_FEE
        );
        return total + profitLoss;
      }
      return total;
    }, 0);

    const unrealizedPL = stock.holding 
      ? (stock.currentMarketPrice - stock.holding.averageBuyPrice) * 
        stock.holding.quantity - 
        (stock.holding ? PORTAL_FEE : 0)
      : 0;

    return {
      totalShares: stock.holding?.quantity || 0,
      averagePrice: stock.holding?.averageBuyPrice || 0,
      totalInvestment,
      netInvestment,
      buyTransactions: buyTransactions.length,
      sellTransactions: sellTransactions.length,
      realizedPL,
      unrealizedPL,
      totalFeesPaid
    };
  }, [stock]);

  const handleOpenCompanyDetails = () => {
    if (!activeSubscription?._id) {
      toast.error('Please activate a subscription to view company details');
      return;
    }
    setShowCompanyModal(true);
  };

  if (!stock || !stock.transactions || stock.transactions.length === 0) {
    return (
      <div className='text-center flex justify-center items-center h-screen text-4xl'>
        PLEASE DO TRADING TO SEE THE HISTORY....
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-800">
            {stock.symbol} Trading History
          </h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Primary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm text-lightBlue-600 mb-2">Total Shares</h4>
              <p className="text-2xl font-bold text-blue-800">
                {stockStats.totalShares} shares
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-100">
              <h4 className="text-sm text-green-600 mb-2">Avg. Buy Price</h4>
              <p className="text-2xl font-bold text-green-800">
                ₹{stockStats.averagePrice.toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-100">
              <h4 className="text-sm text-purple-600 mb-2">Total Investment</h4>
              <p className="text-2xl font-bold text-purple-800">
                ₹{stockStats.totalInvestment.toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-100">
              <h4 className="text-sm text-orange-600 mb-2">Total Fees Paid</h4>
              <p className="text-2xl font-bold text-orange-800">
                ₹{stockStats.totalFeesPaid.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-100">
              <h4 className="text-sm text-indigo-600 mb-2">Trading Activity</h4>
              <p className="text-xl font-bold text-indigo-800">
                {stockStats.buyTransactions} Buys | {stockStats.sellTransactions} Sells
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-100">
              <h4 className="text-sm text-red-600 mb-2">Net Performance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Realized P&L:</span>
                  <span className={`font-bold ${stockStats.realizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{stockStats.realizedPL.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unrealized P&L:</span>
                  <span className={`font-bold ${stockStats.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{stockStats.unrealizedPL.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Portal Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stock.transactions.map((transaction, index) => {
                  const stockTotal = transaction.price * transaction.numberOfShares;
                  const netAmount = transaction.type === 'buy' 
                    ? stockTotal + PORTAL_FEE 
                    : stockTotal - PORTAL_FEE;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'buy' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.numberOfShares}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        ₹{transaction.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        ₹{stockTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-orange-600">
                        ₹{PORTAL_FEE.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        ₹{netAmount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Company Details Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleOpenCompanyDetails}
              className="px-4 py-2 bg-lightBlue-600 text-white rounded-lg hover:bg-lightBlue-600 transition-colors"
            >
              View Company Details
            </button>
          </div>
        </div>
      </div>

      {/* Company Detail Modal */}
      {showCompanyModal && (
        <CompanyDetailModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        symbol={stock.symbol}
        type={stock.type || 'nifty50'} // Use the type from stock or default to nifty50
        userData={{
          ...user,
          subscriptionPlanId: activeSubscription?._id
        }}
      />
      )}
    </div>
  );
};

export default StockDetailsModal;