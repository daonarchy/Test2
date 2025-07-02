export default function LeaderboardTab() {
  const mockLeaderboard = [
    { rank: 1, address: "0x1234...abcd", volume: 2500000, rewards: 1250.5, winRate: 89.2 },
    { rank: 2, address: "0x5678...efgh", volume: 2100000, rewards: 1050.3, winRate: 85.7 },
    { rank: 3, address: "0x9abc...ijkl", volume: 1850000, rewards: 925.8, winRate: 82.1 },
    { rank: 4, address: "0xdef0...mnop", volume: 1650000, rewards: 825.2, winRate: 78.5 },
    { rank: 5, address: "0x1357...qrst", volume: 1420000, rewards: 710.6, winRate: 75.3 },
  ];

  const yourRank = 42;
  const yourVolume = 125000;
  const yourRewards = 62.5;

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Trading Leaderboard</h2>
        
        {/* Your Stats */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-user text-yellow-400 mr-2"></i>
            Your Ranking
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">#{yourRank}</div>
              <div className="text-xs text-gray-400">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">${(yourVolume / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-400">Volume</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{yourRewards} $GNS</div>
              <div className="text-xs text-gray-400">Rewards</div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-trophy text-gold mr-2"></i>
            Top Traders This Week
          </h3>
          
          <div className="space-y-3">
            {mockLeaderboard.map((trader) => (
              <div key={trader.rank} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    trader.rank === 1 ? "bg-yellow-500 text-black" :
                    trader.rank === 2 ? "bg-gray-400 text-black" :
                    trader.rank === 3 ? "bg-orange-400 text-black" :
                    "bg-gray-700 text-white"
                  }`}>
                    #{trader.rank}
                  </div>
                  <div>
                    <div className="text-white font-medium">{trader.address}</div>
                    <div className="text-xs text-gray-400">Win Rate: {trader.winRate}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${(trader.volume / 1000000).toFixed(1)}M</div>
                  <div className="text-green-400 text-sm">{trader.rewards.toFixed(1)} $GNS</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Info */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-calendar text-blue-400 mr-2"></i>
            Weekly Competition
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Total Prize Pool:</span>
              <span className="text-yellow-400 font-bold">163,636 $ARB</span>
            </div>
            <div className="flex justify-between">
              <span>Time Remaining:</span>
              <span className="text-white">4d 12h 35m</span>
            </div>
            <div className="flex justify-between">
              <span>Participants:</span>
              <span className="text-white">2,847 traders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}