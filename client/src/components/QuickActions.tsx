import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";

interface QuickActionsProps {
  onQuickTrade: (direction: "long" | "short", amount: number) => void;
}

export default function QuickActions({ onQuickTrade }: QuickActionsProps) {
  const { isConnected } = useWallet();
  
  const quickAmounts = [100, 500, 1000, 2500];

  return (
    <div className="trading-bg-secondary rounded-xl p-4">
      <h3 className="font-semibold text-white mb-3">Quick Trade</h3>
      
      <div className="space-y-3">
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {quickAmounts.map((amount) => (
            <div key={amount} className="space-y-1">
              <div className="text-center trading-text-gray text-xs">${amount}</div>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  size="sm"
                  disabled={!isConnected}
                  onClick={() => onQuickTrade("long", amount)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs py-1.5"
                >
                  Long
                </Button>
                <Button
                  size="sm"
                  disabled={!isConnected}
                  onClick={() => onQuickTrade("short", amount)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs py-1.5"
                >
                  Short
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {!isConnected && (
          <div className="text-center text-xs trading-text-gray mt-2">
            Connect wallet to quick trade
          </div>
        )}
      </div>
    </div>
  );
}