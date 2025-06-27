import { useState } from "react";
import { formatPrice, formatChange } from "@/lib/utils";

interface Position {
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
}

export default function MexcPositionList() {
  const [activeTab, setActiveTab] = useState<"positions" | "orders">("positions");

  const mockPositions: Position[] = [
    {
      symbol: "BTC/USDT",
      side: "long",
      size: 0.25,
      entryPrice: 43180.00,
      markPrice: 43250.00,
      pnl: 175.00,
      pnlPercent: 4.05,
      margin: 1079.50
    },
    {
      symbol: "ETH/USDT",
      side: "short", 
      size: 2.0,
      entryPrice: 2665.00,
      markPrice: 2650.00,
      pnl: 150.00,
      pnlPercent: 2.82,
      margin: 1064.00
    }
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab("positions")}
          className={`flex-1 py-2 px-3 text-xs font-medium ${
            activeTab === "positions"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-gray-400"
          }`}
        >
          Positions
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-2 px-3 text-xs font-medium ${
            activeTab === "orders"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-gray-400"
          }`}
        >
          Orders
        </button>
      </div>

      {/* Content */}
      <div className="max-h-32 overflow-y-auto">
        {activeTab === "positions" ? (
          mockPositions.length > 0 ? (
            <div className="p-2 space-y-2">
              {mockPositions.map((position, index) => (
                <div key={index} className="bg-gray-800 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-medium">{position.symbol}</span>
                      <span className={`text-xs px-1 rounded ${
                        position.side === "long" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}>
                        {position.side.toUpperCase()}
                      </span>
                    </div>
                    <button className="text-red-400 text-xs">Close</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-400">Size</div>
                      <div className="text-white">{position.size}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Entry</div>
                      <div className="text-white">${formatPrice(position.entryPrice)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">P&L</div>
                      <div className={position.pnl >= 0 ? "text-green-400" : "text-red-400"}>
                        ${position.pnl.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              No open positions
            </div>
          )
        ) : (
          <div className="p-4 text-center text-gray-400 text-sm">
            No pending orders
          </div>
        )}
      </div>
    </div>
  );
}