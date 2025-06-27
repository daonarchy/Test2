import { useState, useEffect } from "react";
import { formatPrice, formatChange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Position {
  id: string;
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  liquidationPrice: number;
}

export default function PositionTracker() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [showClosed, setShowClosed] = useState(false);

  useEffect(() => {
    // Mock positions data
    const mockPositions: Position[] = [
      {
        id: "1",
        symbol: "BTC/USD",
        side: "long",
        size: 0.25,
        entryPrice: 43180.00,
        currentPrice: 43250.00,
        leverage: 10,
        pnl: 175.00,
        pnlPercent: 4.05,
        margin: 1079.50,
        liquidationPrice: 38862.00
      },
      {
        id: "2",
        symbol: "ETH/USD",
        side: "short",
        size: 2.0,
        entryPrice: 2665.00,
        currentPrice: 2650.00,
        leverage: 5,
        pnl: 150.00,
        pnlPercent: 2.82,
        margin: 1064.00,
        liquidationPrice: 2798.25
      }
    ];

    setPositions(mockPositions);

    // Update positions with small price movements
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        const priceChange = (Math.random() - 0.5) * pos.currentPrice * 0.001;
        const newPrice = pos.currentPrice + priceChange;
        const priceDiff = newPrice - pos.entryPrice;
        const newPnl = priceDiff * pos.size * pos.leverage * (pos.side === "long" ? 1 : -1);
        const newPnlPercent = (newPnl / pos.margin) * 100;

        return {
          ...pos,
          currentPrice: newPrice,
          pnl: newPnl,
          pnlPercent: newPnlPercent
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalMargin = positions.reduce((sum, pos) => sum + pos.margin, 0);
  const totalPnlPercent = totalMargin > 0 ? (totalPnl / totalMargin) * 100 : 0;

  return (
    <div className="trading-bg-secondary rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Positions</h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={!showClosed ? "default" : "ghost"}
              className={`text-xs ${
                !showClosed ? "trading-bg-accent text-white" : "trading-text-gray"
              }`}
              onClick={() => setShowClosed(false)}
            >
              Open
            </Button>
            <Button
              size="sm"
              variant={showClosed ? "default" : "ghost"}
              className={`text-xs ${
                showClosed ? "trading-bg-accent text-white" : "trading-text-gray"
              }`}
              onClick={() => setShowClosed(true)}
            >
              History
            </Button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="trading-text-gray">Total P&L</div>
            <div className={`font-bold ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="trading-text-gray">P&L %</div>
            <div className={`font-bold ${totalPnlPercent >= 0 ? "text-green-400" : "text-red-400"}`}>
              {formatChange(totalPnlPercent)}
            </div>
          </div>
          <div>
            <div className="trading-text-gray">Margin Used</div>
            <div className="text-white font-bold">${totalMargin.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto trading-scrollbar">
        {positions.length === 0 ? (
          <div className="p-4 text-center trading-text-gray">
            <i className="fas fa-chart-line text-2xl mb-2"></i>
            <p>No {showClosed ? "closed" : "open"} positions</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {positions.map((position) => (
              <div
                key={position.id}
                className="trading-bg-dark rounded-lg p-3 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{position.symbol}</span>
                    <Badge
                      variant={position.side === "long" ? "default" : "destructive"}
                      className={`text-xs ${
                        position.side === "long" 
                          ? "bg-green-600 text-white" 
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {position.side.toUpperCase()}
                    </Badge>
                    <span className="text-xs trading-text-gray">{position.leverage}x</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-600/20"
                  >
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="trading-text-gray">Size:</span>
                      <span className="text-white">{position.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="trading-text-gray">Entry:</span>
                      <span className="text-white">${formatPrice(position.entryPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="trading-text-gray">Current:</span>
                      <span className="text-white">${formatPrice(position.currentPrice)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="trading-text-gray">P&L:</span>
                      <span className={position.pnl >= 0 ? "text-green-400" : "text-red-400"}>
                        {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="trading-text-gray">%:</span>
                      <span className={position.pnlPercent >= 0 ? "text-green-400" : "text-red-400"}>
                        {formatChange(position.pnlPercent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="trading-text-gray">Liq:</span>
                      <span className="text-red-400">${formatPrice(position.liquidationPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}