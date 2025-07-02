import { useWallet } from "@/hooks/useWallet";
import { useAccount } from 'wagmi';

export default function ProfileTab() {
  const { isConnected, address, user, isInFarcaster, disconnect } = useWallet();
  const { chain } = useAccount();
  const chainName = chain?.name || 'Base';

  const handleSwitchNetwork = () => {
    // Dummy function for switching network
    alert("Network switching... This is a placeholder function.");
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkIcon = (networkName: string) => {
    const icons: Record<string, string> = {
      "Polygon": "🟣",
      "Arbitrum": "🔵", 
      "Base": "🔵",
      "Ethereum": "🔷"
    };
    return icons[networkName] || "🔗";
  };

  // Remove Farcaster-only restriction

  if (!isConnected || !address) {
    return (
      <div className="bg-black text-white p-4 pb-20">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
            <div className="mb-4">
              <i className="fas fa-wallet text-gray-400 text-4xl mb-3"></i>
              <h3 className="text-lg font-semibold text-gray-300">No Wallet Connected</h3>
              <p className="text-gray-400 text-sm">
                {isInFarcaster ? "Connecting to your Farcaster wallet..." : "Connect a wallet to access your profile"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        
        {/* Farcaster Profile */}
        {user && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="text-purple-400 mr-2">🦄</span>
              Farcaster Profile
            </h3>
            
            <div className="bg-gray-800 rounded-lg p-3 mb-3">
              <div className="flex items-center space-x-3">
                {user.pfpUrl && (
                  <img 
                    src={user.pfpUrl} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border border-gray-600"
                  />
                )}
                <div>
                  <div className="text-white font-semibold">
                    {user.displayName || user.username || 'Farcaster User'}
                  </div>
                  {user.username && (
                    <div className="text-purple-400 text-sm">@{user.username}</div>
                  )}
                  {user.fid && (
                    <div className="text-gray-400 text-xs">FID: {user.fid}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Information */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-wallet text-green-400 mr-2"></i>
            Embedded Wallet
          </h3>
          
          <div className="bg-gray-800 rounded-lg p-3 mb-3">
            <div className="text-gray-400 text-sm mb-1">Wallet Address</div>
            <div className="flex items-center justify-between">
              <div className="text-white font-mono text-sm">
                {shortenAddress(address)}
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(address)}
                className="text-blue-400 hover:text-blue-300 ml-2"
                title="Copy address"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Automatically connected via Farcaster
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-sm mb-1">Connected Network</div>
            <div className="flex items-center">
              <span className="text-lg mr-2">{getNetworkIcon(chainName)}</span>
              <span className="text-white font-medium">{chainName}</span>
              <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Network Actions */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-network-wired text-blue-400 mr-2"></i>
            Network Settings
          </h3>
          
          <button
            onClick={handleSwitchNetwork}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center mb-3"
          >
            <i className="fas fa-exchange-alt mr-2"></i>
            Switch Network
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-800 rounded p-2 text-center">
              <div className="text-purple-400">🟣 Polygon</div>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <div className="text-blue-400">🔵 Arbitrum</div>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <div className="text-blue-400">🔵 Base</div>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <div className="text-blue-400">🔷 Ethereum</div>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-info-circle text-blue-400 mr-2"></i>
            App Information
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Version:</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform:</span>
              <span className="text-white">Farcaster Mini App</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network:</span>
              <span className="text-white">Base Chain</span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-900 rounded-lg">
            <div className="text-xs text-blue-200">
              Wallet automatically connected via Farcaster. No manual connection/disconnection required.
            </div>
          </div>
        </div>

        {/* Trading Stats */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-chart-line text-yellow-400 mr-2"></i>
            Trading Summary
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">Total Volume</div>
              <div className="text-white font-bold">$125.4K</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">Total Trades</div>
              <div className="text-white font-bold">342</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">Win Rate</div>
              <div className="text-green-400 font-bold">68.5%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">Total P&L</div>
              <div className="text-green-400 font-bold">+$2.8K</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}