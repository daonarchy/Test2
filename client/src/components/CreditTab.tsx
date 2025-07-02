export default function CreditTab() {
  const totalCredit = 5000; // Mock total credit amount
  const usedCredit = 2750; // Mock used credit
  const availableCredit = totalCredit - usedCredit;

  const handleBuyMoreCredit = () => {
    // Dummy function for buying more credit
    alert("Redirecting to credit purchase... This is a placeholder function.");
  };

  const creditUsagePercentage = (usedCredit / totalCredit) * 100;

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Trading Credit</h2>
        
        {/* Credit Overview */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-credit-card text-blue-400 mr-2"></i>
            Total Credit Balance
          </h3>
          <div className="text-3xl font-bold text-blue-400 mb-2">
            ${totalCredit.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">
            Available for trading positions
          </div>
        </div>

        {/* Credit Usage Breakdown */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Credit Usage</h3>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Used</span>
              <span className="text-white">{creditUsagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${creditUsagePercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 text-sm">Used Credit</div>
              <div className="text-red-400 font-bold text-lg">
                ${usedCredit.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 text-sm">Available</div>
              <div className="text-green-400 font-bold text-lg">
                ${availableCredit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Buy More Credit */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-plus-circle text-green-400 mr-2"></i>
            Increase Credit Limit
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Need more trading power? Increase your credit limit to open larger positions and maximize your trading potential.
          </p>
          
          <button
            onClick={handleBuyMoreCredit}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center"
          >
            <i className="fas fa-shopping-cart mr-2"></i>
            Buy More Credit
          </button>
        </div>

        {/* Credit Information */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-info-circle text-yellow-400 mr-2"></i>
            How Credit Works
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-start">
              <i className="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Credit is used as collateral for leveraged positions</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Higher credit allows for larger position sizes</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Credit is automatically released when positions close</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Buy credit with USDC or other supported tokens</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}