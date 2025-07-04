import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown, Check } from "lucide-react";
import { useChain, type SupportedChain } from "@/hooks/useChain";

interface ChainConfig {
  name: SupportedChain;
  displayName: string;
  icon: string;
  color: string;
}

const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    name: 'arbitrum',
    displayName: 'Arbitrum',
    icon: '🔷',
    color: 'bg-blue-600',
  },
  {
    name: 'polygon',
    displayName: 'Polygon',
    icon: '🟣',
    color: 'bg-purple-600',
  },
  {
    name: 'base',
    displayName: 'Base',
    icon: '🔵',
    color: 'bg-blue-500',
  },
];

export default function ChainSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedChain, switchChain, isConnectedToCorrectChain } = useChain();

  const currentChainConfig = SUPPORTED_CHAINS.find(chain => chain.name === selectedChain);

  const handleChainSelect = (chainName: SupportedChain) => {
    switchChain(chainName);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
        >
          <span className="mr-1">{currentChainConfig?.icon}</span>
          <span className="text-xs">{currentChainConfig?.displayName}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-white">Select Network</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          {SUPPORTED_CHAINS.map((chain) => (
            <Button
              key={chain.name}
              variant="ghost"
              className="w-full justify-between p-3 h-auto hover:bg-gray-800"
              onClick={() => handleChainSelect(chain.name)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{chain.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-white">{chain.displayName}</div>
                  <div className="text-xs text-gray-400">
                    {chain.name === 'polygon' ? 'Lower minimums' : 
                     chain.name === 'base' ? 'USDC only' : 'Standard'}
                  </div>
                </div>
              </div>
              {selectedChain === chain.name && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </Button>
          ))}
        </div>
        
        {!isConnectedToCorrectChain && (
          <div className="text-xs text-yellow-400 text-center pt-2 border-t border-gray-700">
            ⚠️ Please switch your wallet to {currentChainConfig?.displayName}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}