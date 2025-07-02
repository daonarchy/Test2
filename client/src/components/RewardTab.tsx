export default function RewardTab() {
  const weeklyVolume = 125000; // Mock weekly trading volume
  const estimatedReward = 45.8; // Mock estimated reward in $GNS
  const claimableReward = 23.4; // Mock claimable reward

  const handleClaimRewards = () => {
    // Dummy function for claiming rewards
    alert("Claiming rewards... This is a placeholder function.");
  };

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Rewards</h2>
        
        {/* Weekly Trading Stats */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-chart-bar text-yellow-400 mr-2"></i>
            Weekly Trading Volume
          </h3>
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            ${weeklyVolume.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">
            Current week trading volume
          </div>
        </div>

        {/* Estimated Rewards */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-coins text-green-400 mr-2"></i>
            Estimated Weekly Reward
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {estimatedReward} $GNS
              </div>
              <div className="text-sm text-gray-400">
                Based on current volume
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">USD Value</div>
              <div className="text-white font-medium">
                ~${(estimatedReward * 2.34).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Claimable Rewards */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-gift text-purple-400 mr-2"></i>
            Claimable Rewards
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {claimableReward} $GNS
              </div>
              <div className="text-sm text-gray-400">
                Ready to claim
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">USD Value</div>
              <div className="text-white font-medium">
                ~${(claimableReward * 2.34).toFixed(2)}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleClaimRewards}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center"
          >
            <i className="fas fa-hand-holding-usd mr-2"></i>
            Claim Rewards
          </button>
        </div>

        {/* Reward Information */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-info-circle text-blue-400 mr-2"></i>
            How Rewards Work
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-start">
              <i className="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Earn $GNS tokens based on your weekly trading volume</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Higher volume = higher rewards multiplier</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>Rewards are distributed weekly on Sundays</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-400 mr-2 mt-1"></i>
              <span>No minimum trading requirement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}