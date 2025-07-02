export default function AnalyticsTab() {
  const analyticsData = {
    totalVolume: 1250000,
    totalTrades: 342,
    totalPnL: 2850,
    winRate: 68.5,
    avgHoldTime: "2h 15m",
    bestPair: "BTC/USD",
    profitableDays: 24,
    totalDays: 30,
    largestWin: 450,
    largestLoss: -180
  };

  const weeklyData = [
    { week: "Week 1", volume: 285000, pnl: 650, trades: 89 },
    { week: "Week 2", volume: 320000, pnl: 780, trades: 95 },
    { week: "Week 3", volume: 275000, pnl: 520, trades: 82 },
    { week: "Week 4", volume: 370000, pnl: 900, trades: 76 }
  ];

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Trading Analytics</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Total Volume</div>
            <div className="text-white font-bold text-lg">${(analyticsData.totalVolume / 1000000).toFixed(2)}M</div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Total P&L</div>
            <div className="text-green-400 font-bold text-lg">+${analyticsData.totalPnL}</div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Win Rate</div>
            <div className="text-yellow-400 font-bold text-lg">{analyticsData.winRate}%</div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Total Trades</div>
            <div className="text-white font-bold text-lg">{analyticsData.totalTrades}</div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-chart-line text-blue-400 mr-2"></i>
            Weekly Performance
          </h3>
          <div className="space-y-3">
            {weeklyData.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm w-16">{week.week}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2 w-24">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min((week.volume / 400000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">${(week.volume / 1000).toFixed(0)}K</div>
                  <div className={`text-xs ${week.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {week.pnl >= 0 ? "+" : ""}${week.pnl}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Stats */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-chart-bar text-green-400 mr-2"></i>
            Trading Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Average Hold Time:</span>
              <span className="text-white">{analyticsData.avgHoldTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Best Trading Pair:</span>
              <span className="text-yellow-400">{analyticsData.bestPair}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Profitable Days:</span>
              <span className="text-green-400">{analyticsData.profitableDays}/{analyticsData.totalDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Largest Win:</span>
              <span className="text-green-400">+${analyticsData.largestWin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Largest Loss:</span>
              <span className="text-red-400">${analyticsData.largestLoss}</span>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-shield-alt text-red-400 mr-2"></i>
            Risk Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">Max Drawdown</div>
              <div className="text-red-400 font-bold">-5.2%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">Sharpe Ratio</div>
              <div className="text-yellow-400 font-bold">1.84</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">Avg Risk/Trade</div>
              <div className="text-white font-bold">2.1%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">Recovery Factor</div>
              <div className="text-green-400 font-bold">3.8</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}