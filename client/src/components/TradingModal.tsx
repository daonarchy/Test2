import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice, calculateLiquidationPrice, calculateMarginRequired, calculatePositionSize } from "@/lib/utils";
import type { TradingPair } from "@shared/schema";

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: TradingPair;
  direction: "long" | "short";
  onDirectionChange: (direction: "long" | "short") => void;
}

export default function TradingModal({
  isOpen,
  onClose,
  asset,
  direction,
  onDirectionChange,
}: TradingModalProps) {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [positionSize, setPositionSize] = useState("");
  const [leverage, setLeverage] = useState([10]);
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPositionSize("");
      setLeverage([10]);
      setTakeProfit("");
      setStopLoss("");
      setLimitPrice("");
    }
  }, [isOpen]);

  const entryPrice = orderType === "limit" && limitPrice 
    ? parseFloat(limitPrice) 
    : parseFloat(asset.price);

  const usdAmount = parseFloat(positionSize) || 0;
  const leverageValue = leverage[0];
  const calculatedSize = usdAmount > 0 ? calculatePositionSize(usdAmount, entryPrice) : 0;
  const marginRequired = usdAmount > 0 ? calculateMarginRequired(calculatedSize, entryPrice, leverageValue) : 0;
  const liquidationPrice = usdAmount > 0 ? calculateLiquidationPrice(entryPrice, leverageValue, direction) : 0;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: async (order) => {
      // Execute the trade
      try {
        const executeResponse = await apiRequest("POST", "/api/execute-trade", {
          orderId: order.id,
          signature: "mock_signature"
        });
        const result = await executeResponse.json();
        
        toast({
          title: "Trade Executed Successfully",
          description: `${direction.toUpperCase()} position opened for ${asset.symbol}`,
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/trading-pairs"] });
        onClose();
      } catch (error) {
        toast({
          title: "Trade Execution Failed",
          description: "Failed to execute trade on blockchain",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Order Creation Failed",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!positionSize || parseFloat(positionSize) <= 0) {
      toast({
        title: "Invalid Position Size",
        description: "Please enter a valid position size",
        variant: "destructive",
      });
      return;
    }

    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Limit Price",
        description: "Please enter a valid limit price",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: 1, // Mock user ID
      pairId: asset.id,
      type: orderType,
      direction,
      size: calculatedSize.toFixed(8),
      leverage: leverageValue,
      entryPrice: orderType === "market" ? null : limitPrice,
      limitPrice: orderType === "limit" ? limitPrice : null,
      takeProfit: takeProfit || null,
      stopLoss: stopLoss || null,
      marginRequired: marginRequired.toFixed(8),
    };

    createOrderMutation.mutate(orderData);
  };

  const getAssetIcon = () => {
    const iconClass = asset.icon;
    if (!iconClass) return "fas fa-coins";
    
    if (iconClass.includes("bitcoin")) return "fab fa-bitcoin";
    if (iconClass.includes("ethereum")) return "fab fa-ethereum";
    if (iconClass.includes("apple")) return "fab fa-apple";
    
    return iconClass;
  };

  const getAssetColor = () => {
    const colors: Record<string, string> = {
      "BTC/USD": "bg-orange-500",
      "ETH/USD": "bg-blue-500",
      "BNB/USD": "bg-yellow-500",
      "SOL/USD": "bg-purple-500",
      "ADA/USD": "bg-teal-500",
      "AAPL/USD": "bg-gray-600",
      "TSLA/USD": "bg-red-600",
    };
    return colors[asset.symbol] || "bg-gray-500";
  };

  const getAssetText = () => {
    if (asset.icon === "bnb") return "BNB";
    if (asset.icon === "sol") return "SOL";
    if (asset.icon === "ada") return "ADA";
    if (asset.icon === "tsla") return "TSLA";
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="trading-bg-secondary text-white border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Open Position</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Selection */}
          <div>
            <Label className="block text-sm font-medium trading-text-gray mb-2">Asset</Label>
            <div className="trading-bg-dark rounded-lg p-3 flex items-center space-x-3">
              <div className={`w-8 h-8 ${getAssetColor()} rounded-full flex items-center justify-center`}>
                {getAssetText() ? (
                  <span className="text-white font-bold text-sm">{getAssetText()}</span>
                ) : (
                  <i className={`${getAssetIcon()} text-white text-sm`}></i>
                )}
              </div>
              <span className="font-medium">{asset.symbol}</span>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <Label className="block text-sm font-medium trading-text-gray mb-2">Order Type</Label>
            <div className="flex space-x-2">
              <Button
                variant={orderType === "market" ? "default" : "ghost"}
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  orderType === "market" 
                    ? "trading-bg-accent text-white" 
                    : "trading-bg-dark trading-text-gray"
                }`}
                onClick={() => setOrderType("market")}
              >
                Market
              </Button>
              <Button
                variant={orderType === "limit" ? "default" : "ghost"}
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  orderType === "limit" 
                    ? "trading-bg-accent text-white" 
                    : "trading-bg-dark trading-text-gray"
                }`}
                onClick={() => setOrderType("limit")}
              >
                Limit
              </Button>
            </div>
          </div>

          {/* Limit Price (only for limit orders) */}
          {orderType === "limit" && (
            <div>
              <Label className="block text-sm font-medium trading-text-gray mb-2">Limit Price</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={formatPrice(asset.price)}
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full trading-bg-dark border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <div className="absolute right-3 top-3 trading-text-gray">USD</div>
              </div>
            </div>
          )}

          {/* Direction */}
          <div>
            <Label className="block text-sm font-medium trading-text-gray mb-2">Direction</Label>
            <div className="flex space-x-2">
              <Button
                className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  direction === "long"
                    ? "bg-green-600 text-white"
                    : "trading-bg-dark trading-text-gray"
                }`}
                onClick={() => onDirectionChange("long")}
              >
                <i className="fas fa-arrow-up"></i>
                <span>Long</span>
              </Button>
              <Button
                className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  direction === "short"
                    ? "bg-red-600 text-white"
                    : "trading-bg-dark trading-text-gray"
                }`}
                onClick={() => onDirectionChange("short")}
              >
                <i className="fas fa-arrow-down"></i>
                <span>Short</span>
              </Button>
            </div>
          </div>

          {/* Position Size */}
          <div>
            <Label className="block text-sm font-medium trading-text-gray mb-2">Position Size (USD)</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                className="w-full trading-bg-dark border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
              <div className="absolute right-3 top-3 trading-text-gray">USD</div>
            </div>
          </div>

          {/* Leverage */}
          <div>
            <Label className="block text-sm font-medium trading-text-gray mb-2">Leverage</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={leverage}
                onValueChange={setLeverage}
                min={1}
                max={asset.maxLeverage}
                step={1}
                className="flex-1 trading-slider"
              />
              <div className="trading-bg-dark px-3 py-2 rounded-lg min-w-[80px] text-center">
                <span>{leverage[0]}</span>x
              </div>
            </div>
            <div className="flex justify-between text-xs trading-text-gray mt-1">
              <span>1x</span>
              <span>{asset.maxLeverage}x</span>
            </div>
          </div>

          {/* Take Profit / Stop Loss */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium trading-text-gray mb-2">Take Profit</Label>
              <Input
                type="number"
                placeholder="Optional"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full trading-bg-dark border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium trading-text-gray mb-2">Stop Loss</Label>
              <Input
                type="number"
                placeholder="Optional"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full trading-bg-dark border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Position Summary */}
          <div className="trading-bg-dark rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="trading-text-gray">Entry Price:</span>
              <span>${formatPrice(entryPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="trading-text-gray">Position Size:</span>
              <span>{calculatedSize.toFixed(6)} {asset.symbol.split('/')[0]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="trading-text-gray">Margin Required:</span>
              <span>${marginRequired.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="trading-text-gray">Liquidation Price:</span>
              <span className="trading-text-danger">${formatPrice(liquidationPrice)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={createOrderMutation.isPending}
            className="w-full trading-bg-accent hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            {createOrderMutation.isPending ? "Processing..." : "Open Position"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
