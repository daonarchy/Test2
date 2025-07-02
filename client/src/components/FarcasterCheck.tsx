import { useWallet } from "@/hooks/useWallet";

export default function FarcasterCheck({ children }: { children: React.ReactNode }) {
  const { isInFarcaster, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading gTrade...</div>
        </div>
      </div>
    );
  }

  if (!isInFarcaster) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <div className="text-yellow-400 font-bold text-3xl mb-2">gTrade</div>
            <div className="text-gray-400">Farcaster Mini App</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <div className="text-2xl mb-4">🦄</div>
            <h2 className="text-white text-xl font-semibold mb-3">
              Please open in Warpcast
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              This mini app requires access to your Farcaster wallet and works best when opened inside Warpcast or another supported Farcaster client.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">Open Warpcast app</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">Navigate to this mini app</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">Start trading with leverage</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Powered by Gains Network • Base Chain
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}