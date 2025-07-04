import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ChevronDown, Check } from "lucide-react";
import { getSupportedCollaterals, getMinimumPositionSize, type CollateralToken } from "@/lib/collaterals";

interface CollateralSelectorProps {
  selectedCollateral: CollateralToken;
  onCollateralChange: (collateral: CollateralToken) => void;
  chainName: string;
  disabled?: boolean;
}

export default function CollateralSelector({ 
  selectedCollateral, 
  onCollateralChange, 
  chainName,
  disabled = false 
}: CollateralSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const supportedCollaterals = getSupportedCollaterals(chainName);

  const handleCollateralSelect = (collateral: CollateralToken) => {
    onCollateralChange(collateral);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCollateral.icon}</span>
            <span className="font-medium">{selectedCollateral.symbol}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Select Collateral</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose your trading collateral for {chainName.charAt(0).toUpperCase() + chainName.slice(1)} network
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2">
          {supportedCollaterals.map((collateral) => (
            <Button
              key={collateral.symbol}
              variant="ghost"
              className="w-full justify-between p-4 h-auto hover:bg-gray-800"
              onClick={() => handleCollateralSelect(collateral)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{collateral.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-white">{collateral.symbol}</div>
                  <div className="text-sm text-gray-400">{collateral.name}</div>
                  <div className="text-xs text-gray-500">
                    Min: ${getMinimumPositionSize(collateral, chainName).toLocaleString()}
                  </div>
                </div>
              </div>
              {selectedCollateral.symbol === collateral.symbol && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </Button>
          ))}
        </div>
        
        <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-700">
          Supported on {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
        </div>
      </DialogContent>
    </Dialog>
  );
}