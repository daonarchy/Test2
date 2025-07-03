import { useGainsLeaderboard } from "../hooks/useGainsMarkets";
import { useWallet } from "../hooks/useWallet";

export default function LeaderboardTab() {
  const { data: leaderboard, isLoading } = useGainsLeaderboard();
  const { address, isConnected } = useWallet();

  // Find user's position in leaderboard
  const userRank = leaderboard?.findIndex(trader => trader.address.toLowerCase() === address?.toLowerCase()) ?? -1;
  const userStats = userRank >= 0 ? leaderboard?.[userRank] : null;

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Trading Leaderboard</h2>
        
        {/* Prize Pool Info */}
        <div className="bg-gradient-to-r from-yellow-900 to-orange-900 border border-yellow-600 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center text-yellow-400">
            <i className="fas fa-trophy mr-2"></i>
            Weekly Prize Pool
          </h3>
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            16,500 $BtcUSD
          </div>
          <div className="text-sm text-gray-200">
            Gold Rush on Base - Trading Competition
          </div>
        </div>

        {/* Your Stats */}
        {isConnected && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <i className="fas fa-user text-yellow-400 mr-2"></i>
              Your Ranking
            </h3>
            {userStats ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">#{userRank + 1}</div>
                  <div className="text-xs text-gray-400">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{userStats.volume}</div>
                  <div className="text-xs text-gray-400">Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">{userStats.pnl}</div>
                  <div className="text-xs text-gray-400">PnL</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-lg">No trades yet</div>
                <div className="text-sm">Start trading to appear on leaderboard</div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-trophy text-gold mr-2"></i>
            Top Traders This Week
          </h3>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-400 py-4">Loading leaderboard...</div>
            ) : leaderboard && leaderboard.length > 0 ? (
              leaderboard.slice(0, 10).map((trader: any) => (
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
                      <div className="text-white font-medium">{trader.trader || 'Anonymous'}</div>
                      <div className="text-xs text-gray-400">Win Rate: {trader.winRate || '0%'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{trader.volume}</div>
                    <div className="text-yellow-400 text-sm">{trader.pnl}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-4">No traders yet</div>
            )}
          </div>
        </div>

        {/* Competition Info */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-calendar text-blue-400 mr-2"></i>
            Gold Rush Competition
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Total Prize Pool:</span>
              <span className="text-yellow-400 font-bold">33,000+ $BtcUSD</span>
            </div>
            <div className="flex justify-between">
              <span>Distribution:</span>
              <span className="text-white">Every 2 weeks</span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="text-blue-400">Base Chain</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}