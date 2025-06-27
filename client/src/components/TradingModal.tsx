import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState<"order" | "advanced">("order");
  const [positionType, setPositionType] = useState<"usd" | "units">("usd");

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
      <DialogContent className="trading-bg-secondary text-white border-gray-700 max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className={`w-6 h-6 ${getAssetColor()} rounded-full flex items-center justify-center`}>
                {getAssetText() ? (
                  <span className="text-white font-bold text-xs">{getAssetText()}</span>
                ) : (
                  <i className={`${getAssetIcon()} text-white text-xs`}></i>
                )}
              </div>
              <span>{asset.symbol}</span>
              <span className="text-sm trading-text-gray">Max {asset.maxLeverage}x</span>
            </DialogTitle>
            <div className="text-right">
              <div className="text-lg font-bold">${formatPrice(asset.price)}</div>
              <div className={`text-sm ${parseFloat(asset.change24h) >= 0 ? "text-green-500" : "text-red-500"}`}>
                {parseFloat(asset.change24h) >= 0 ? "+" : ""}{asset.change24h}%
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "order" | "advanced")} className="h-full">
          <TabsList className="grid w-full grid-cols-2 trading-bg-dark">
            <TabsTrigger value="order" className="text-sm">Order</TabsTrigger>
            <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] pr-2">
            <TabsContent value="order" className="space-y-4 mt-4">
              {/* Direction - Made more prominent */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className={`py-4 px-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
                    direction === "long"
                      ? "bg-green-600 hover:bg-green-700 text-white border-2 border-green-400"
                      : "trading-bg-dark border-2 border-gray-600 trading-text-gray hover:border-green-400"
                  }`}
                  onClick={() => onDirectionChange("long")}
                >
                  <i className="fas fa-arrow-up"></i>
                  <span>BUY / LONG</span>
                </Button>
                <Button
                  className={`py-4 px-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
                    direction === "short"
                      ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
                      : "trading-bg-dark border-2 border-gray-600 trading-text-gray hover:border-red-400"
                  }`}
                  onClick={() => onDirectionChange("short")}
                >
                  <i className="fas fa-arrow-down"></i>
                  <span>SELL / SHORT</span>
                </Button>
              </div>

              {/* Order Type */}
              <div>
                <Label className="block text-sm font-medium trading-text-gray mb-2">Order Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={orderType === "market" ? "default" : "ghost"}
                    className={`py-3 px-4 rounded-lg font-medium ${
                      orderType === "market" 
                        ? "trading-bg-accent text-white" 
                        : "trading-bg-dark trading-text-gray border border-gray-600"
                    }`}
                    onClick={() => setOrderType("market")}
                  >
                    Market
                  </Button>
                  <Button
                    variant={orderType === "limit" ? "default" : "ghost"}
                    className={`py-3 px-4 rounded-lg font-medium ${
                      orderType === "limit" 
                        ? "trading-bg-accent text-white" 
                        : "trading-bg-dark trading-text-gray border border-gray-600"
                    }`}
                    onClick={() => setOrderType("limit")}
                  >
                    Limit
                  </Button>
                  <Button
                    variant="ghost"
                    className="py-3 px-4 rounded-lg font-medium trading-bg-dark trading-text-gray border border-gray-600 opacity-50"
                    disabled
                  >
                    Stop
                  </Button>
                </div>
              </div>

              {/* Entry Price */}
              <div>
                <Label className="block text-sm font-medium trading-text-gray mb-2">
                  {orderType === "market" ? "Market Price" : "Entry Price"}
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={formatPrice(asset.price)}
                    value={orderType === "market" ? formatPrice(asset.price) : limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    disabled={orderType === "market"}
                    className={`w-full border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 ${
                      orderType === "market" ? "trading-bg-dark/50 cursor-not-allowed" : "trading-bg-dark"
                    }`}
                  />
                  <div className="absolute right-3 top-3 trading-text-gray">USD</div>
                </div>
              </div>

              {/* Position Size */}
              <div>
                <Label className="block text-sm font-medium trading-text-gray mb-2">Position Size</Label>
                <div className="flex space-x-2 mb-2">
                  <Button
                    size="sm"
                    variant={positionType === "usd" ? "default" : "ghost"}
                    className={`text-xs ${
                      positionType === "usd" 
                        ? "trading-bg-accent text-white" 
                        : "trading-bg-dark trading-text-gray"
                    }`}
                    onClick={() => setPositionType("usd")}
                  >
                    USD
                  </Button>
                  <Button
                    size="sm"
                    variant={positionType === "units" ? "default" : "ghost"}
                    className={`text-xs ${
                      positionType === "units" 
                        ? "trading-bg-accent text-white" 
                        : "trading-bg-dark trading-text-gray"
                    }`}
                    onClick={() => setPositionType("units")}
                  >
                    Units
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={positionType === "usd" ? "1000.00" : "0.001"}
                    value={positionSize}
                    onChange={(e) => setPositionSize(e.target.value)}
                    className="w-full trading-bg-dark border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                  <div className="absolute right-3 top-3 trading-text-gray">
                    {positionType === "usd" ? "USD" : asset.symbol.split('/')[0]}
                  </div>
                </div>
                
                {/* Quick Size Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {["25%", "50%", "75%", "MAX"].map((percentage) => (
                    <Button
                      key={percentage}
                      size="sm"
                      variant="ghost"
                      className="text-xs trading-bg-dark border border-gray-600 hover:border-blue-500"
                      onClick={() => {
                        // Mock wallet balance for percentage calculation
                        const mockBalance = 10000;
                        const percent = parseInt(percentage) / 100;
                        if (percentage === "MAX") {
                          setPositionSize(mockBalance.toString());
                        } else {
                          setPositionSize((mockBalance * percent).toString());
                        }
                      }}
                    >
                      {percentage}
                    </Button>
                  ))}
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
                  <div className="trading-bg-dark border border-gray-600 px-4 py-2 rounded-lg min-w-[80px] text-center">
                    <span className="font-bold text-lg">{leverage[0]}</span>x
                  </div>
                </div>
                
                {/* Quick Leverage Buttons */}
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {[1, 5, 10, 25, 50].filter(lev => lev <= asset.maxLeverage).map((lev) => (
                    <Button
                      key={lev}
                      size="sm"
                      variant="ghost"
                      className={`text-xs border ${
                        leverage[0] === lev 
                          ? "border-blue-500 trading-bg-accent" 
                          : "border-gray-600 trading-bg-dark"
                      }`}
                      onClick={() => setLeverage([lev])}
                    >
                      {lev}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Position Summary */}
              <div className="trading-bg-dark border border-gray-600 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-white mb-2">Position Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="trading-text-gray">Entry Price:</span>
                      <span className="font-medium">${formatPrice(entryPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="trading-text-gray">Position Size:</span>
                      <span className="font-medium">{calculatedSize.toFixed(6)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="trading-text-gray">Margin:</span>
                      <span className="font-medium">${marginRequired.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="trading-text-gray">Liq. Price:</span>
                      <span className="text-red-400 font-medium">${formatPrice(liquidationPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              {/* Take Profit / Stop Loss */}
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium trading-text-gray mb-2 flex items-center space-x-2">
                    <i className="fas fa-target text-green-500"></i>
                    <span>Take Profit</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={`Enter price > ${formatPrice(asset.price)}`}
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      className="w-full trading-bg-dark border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                    />
                    <div className="absolute right-3 top-3 trading-text-gray">USD</div>
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium trading-text-gray mb-2 flex items-center space-x-2">
                    <i className="fas fa-shield-alt text-red-500"></i>
                    <span>Stop Loss</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={`Enter price < ${formatPrice(asset.price)}`}
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      className="w-full trading-bg-dark border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    />
                    <div className="absolute right-3 top-3 trading-text-gray">USD</div>
                  </div>
                </div>

                {/* Risk Management Display */}
                {(takeProfit || stopLoss) && (
                  <div className="trading-bg-dark border border-gray-600 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Risk Management</h4>
                    <div className="space-y-2 text-sm">
                      {takeProfit && (
                        <div className="flex justify-between text-green-400">
                          <span>Max Profit:</span>
                          <span>+${((parseFloat(takeProfit) - entryPrice) * calculatedSize * (direction === "long" ? 1 : -1)).toFixed(2)}</span>
                        </div>
                      )}
                      {stopLoss && (
                        <div className="flex justify-between text-red-400">
                          <span>Max Loss:</span>
                          <span>-${((entryPrice - parseFloat(stopLoss)) * calculatedSize * (direction === "long" ? 1 : -1)).toFixed(2)}</span>
                        </div>
                      )}
                      {takeProfit && stopLoss && (
                        <div className="flex justify-between text-blue-400">
                          <span>Risk/Reward:</span>
                          <span>
                            1:{(Math.abs(parseFloat(takeProfit) - entryPrice) / Math.abs(entryPrice - parseFloat(stopLoss))).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Submit Button - Fixed at bottom */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={createOrderMutation.isPending || !positionSize || parseFloat(positionSize) <= 0}
            className={`w-full font-bold py-4 rounded-lg text-lg transition-all ${
              direction === "long"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            } ${createOrderMutation.isPending ? "opacity-50" : ""}`}
          >
            {createOrderMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <i className={`fas ${direction === "long" ? "fa-arrow-up" : "fa-arrow-down"}`}></i>
                <span>
                  {direction === "long" ? "BUY" : "SELL"} {asset.symbol}
                </span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
