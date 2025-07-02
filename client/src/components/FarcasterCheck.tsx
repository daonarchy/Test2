import { useWallet } from "@/hooks/useWallet";

export default function FarcasterCheck({ children }: { children: React.ReactNode }) {
  const { isLoading } = useWallet();

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

  // Always render children - no Farcaster restriction
  return <>{children}</>;
}