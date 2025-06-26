import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";

export default function AppHeader() {
  const { isConnected, address, connect, disconnect } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 trading-bg-secondary trading-border border-b z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 trading-bg-accent rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-white text-sm"></i>
          </div>
          <h1 className="text-lg font-semibold">gTrade</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 trading-bg-dark px-3 py-1.5 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm trading-text-gray">Polygon</span>
          </div>
          
          <Button 
            onClick={isConnected ? disconnect : connect}
            className="trading-bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {isConnected 
              ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
              : "Connect Wallet"
            }
          </Button>
        </div>
      </div>
    </header>
  );
}
