import { useState } from "react";
import { formatPrice } from "@/lib/utils";

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
}

interface Order {
  id: string;
  symbol: string;
  side: "long" | "short";
  type: "market" | "limit";
  size: number;
  price: number;
  leverage: number;
  status: "pending" | "filled" | "cancelled";
  timestamp: string;
}

export default function PortfolioTab() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "rewards" | "credits">("dashboard");
  const [positionTab, setPositionTab] = useState<"positions" | "orders">("positions");

  const mockPositions: Position[] = [
    {
      id: "1",
      symbol: "BTC/USD",
      side: "long",
      size: 0.25,
      entryPrice: 43180.00,
      currentPrice: 43250.00,
      leverage: 20,
      pnl: 175.00,
      pnlPercent: 4.05,
      margin: 1079.50
    },
    {
      id: "2",
      symbol: "ETH/USD",
      side: "short",
      size: 2.0,
      entryPrice: 2665.00,
      currentPrice: 2650.00,
      leverage: 10,
      pnl: 150.00,
      pnlPercent: 2.82,
      margin: 1064.00
    }
  ];

  const mockOrders: Order[] = [
    {
      id: "1",
      symbol: "SOL/USD",
      side: "long",
      type: "limit",
      size: 10,
      price: 148.50,
      leverage: 15,
      status: "pending",
      timestamp: "2025-01-02 10:25"
    }
  ];

  const weeklyVolume = 125000;
  const estimatedReward = 45.8;
  const claimableReward = 23.4;
  const totalCredit = 5000;
  const usedCredit = 2750;
  const availableCredit = totalCredit - usedCredit;

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Portfolio</h2>
        
        {/* Main Tab Selector */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "rewards"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Rewards
          </button>
          <button
            onClick={() => setActiveTab("credits")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "credits"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Credits
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Position/Order Sub-tabs */}
            <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
              <button
                onClick={() => setPositionTab("positions")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  positionTab === "positions"
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Positions ({mockPositions.length})
              </button>
              <button
                onClick={() => setPositionTab("orders")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  positionTab === "orders"
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Orders ({mockOrders.length})
              </button>
            </div>

            {/* Positions List */}
            {positionTab === "positions" && (
              <div className="space-y-3">
                {mockPositions.length > 0 ? (
                  mockPositions.map((position) => (
                    <div key={position.id} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{position.symbol}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            position.side === "long" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                          }`}>
                            {position.side.toUpperCase()}
                          </span>
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            {position.leverage}x
                          </span>
                        </div>
                        <button className="text-red-400 text-sm hover:text-red-300">
                          Close
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-400 text-xs">Size</div>
                          <div className="text-white">{position.size}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs">Entry</div>
                          <div className="text-white">${formatPrice(position.entryPrice)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs">Current</div>
                          <div className="text-white">${formatPrice(position.currentPrice)}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                        <div>
                          <div className="text-gray-400 text-xs">P&L</div>
                          <div className={`font-medium ${position.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                            ${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400 text-xs">Margin</div>
                          <div className="text-white">${position.margin.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <i className="fas fa-chart-line text-3xl mb-2"></i>
                    <p>No open positions</p>
                  </div>
                )}
              </div>
            )}

            {/* Orders List */}
            {positionTab === "orders" && (
              <div className="space-y-3">
                {mockOrders.length > 0 ? (
                  mockOrders.map((order) => (
                    <div key={order.id} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{order.symbol}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.side === "long" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                          }`}>
                            {order.side.toUpperCase()}
                          </span>
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                            {order.type.toUpperCase()}
                          </span>
                        </div>
                        <button className="text-red-400 text-sm hover:text-red-300">
                          Cancel
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-400 text-xs">Size</div>
                          <div className="text-white">{order.size}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs">Price</div>
                          <div className="text-white">${formatPrice(order.price)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs">Leverage</div>
                          <div className="text-white">{order.leverage}x</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                        <div>
                          <div className="text-gray-400 text-xs">Status</div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            order.status === "pending" ? "bg-yellow-600 text-white" :
                            order.status === "filled" ? "bg-green-600 text-white" :
                            "bg-gray-600 text-white"
                          }`}>
                            {order.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400 text-xs">Time</div>
                          <div className="text-white text-xs">{order.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <i className="fas fa-clipboard-list text-3xl mb-2"></i>
                    <p>No pending orders</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Rewards Tab */}
        {activeTab === "rewards" && (
          <div className="space-y-4">
            {/* Gold Rush Program */}
            <div className="bg-gradient-to-r from-yellow-900 to-orange-900 border border-yellow-600 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">⛏️</span>
                <h3 className="text-lg font-semibold text-yellow-400">
                  Welcome to the Gold Rush on Base
                </h3>
              </div>
              <div className="text-sm text-gray-200 mb-3">
                Dive into our 12-week trading incentive program, now live!
              </div>
              <div className="text-sm text-gray-200 mb-2">
                Trade on Base and earn a share of up to
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                33,000+ $BtcUSD every 2 weeks
              </div>
              <div className="text-xs text-gray-300">
                Your share is based on three categories: Fees, PnL, Loyalty
              </div>
            </div>

            {/* Reward Categories */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Your Est. Rewards</h3>
              
              {/* Fees Category */}
              <div className="mb-4 p-3 bg-gray-800 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-yellow-400">Fees</span>
                  <span className="text-yellow-400">8.45 $BtcUSD</span>
                </div>
                <div className="text-xs text-gray-400">
                  The more fees you pay, the higher your reward. Your share is determined by your total fees paid against all protocol fees for the epoch.
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  * Rewards for this category are capped at 100% total protocol fees
                </div>
              </div>

              {/* PnL Category */}
              <div className="mb-4 p-3 bg-gray-800 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-green-400">PnL</span>
                  <span className="text-yellow-400">4.82 $BtcUSD</span>
                </div>
                <div className="text-xs text-gray-400">
                  Your share is determined by your total PnL against all protocol positive PnL for the epoch.
                </div>
              </div>

              {/* Loyalty Category */}
              <div className="mb-4 p-3 bg-gray-800 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-purple-400">Loyalty</span>
                  <span className="text-yellow-400">1.23 $BtcUSD</span>
                </div>
                <div className="text-xs text-gray-400">
                  Your share is determined by your total loyalty points against all protocol loyalty points for the epoch.
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Total Estimated</span>
                  <span className="font-bold text-yellow-400 text-lg">14.50 $BtcUSD</span>
                </div>
              </div>
            </div>

            {/* Reward Distribution Info */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                Reward Distribution
              </h3>
              <div className="text-sm text-gray-400 mb-2">
                Up to 6,666 🪙
              </div>
              <div className="text-xs text-gray-400">
                Rewards are calculated biweekly and will be made available for claim every 2nd Friday. For transparency, our reward system is fully auditable through on-chain metrics.
              </div>
            </div>

            {/* Claim Button */}
            <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center">
              <i className="fas fa-coins mr-2"></i>
              Start Trading
            </button>

            {/* Info */}
            <div className="text-xs text-gray-400 text-center">
              Have questions? Ask in{" "}
              <a href="https://t.me/GainsNetwork" className="text-blue-400 underline">
                Telegram
              </a>{" "}
              or see the{" "}
              <a href="https://gains-network.gitbook.io/docs-home/gtrade-leveraged-trading/arbitrum-stip-incentives" className="text-blue-400 underline">
                Rewards
              </a>{" "}
              page.
            </div>
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === "credits" && (
          <div className="space-y-4">
            {/* Current Status */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">gTrade Credits</h3>
              <div className="text-sm text-gray-400 mb-4">
                Trading discount based on trailing 30d volume, excluding today
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">0%</div>
                  <div className="text-xs text-gray-400">Current Discount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-xs text-gray-400">Total Credits (30d)</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded p-3 text-center">
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-xs text-gray-400">Outbound Credits</div>
                </div>
                <div className="bg-gray-800 rounded p-3 text-center">
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-xs text-gray-400">Inbound Credits</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-900 rounded">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">0%</div>
                  <div className="text-xs text-gray-300">Tomorrow's Discount</div>
                </div>
              </div>
            </div>

            {/* Tier Table */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Discount Tiers</h3>
              <div className="space-y-2">
                {[
                  { tier: 1, credits: "6M", discount: "2.5%" },
                  { tier: 2, credits: "20M", discount: "5.0%" },
                  { tier: 3, credits: "50M", discount: "7.5%" },
                  { tier: 4, credits: "100M", discount: "10.0%" },
                  { tier: 5, credits: "250M", discount: "13.0%" },
                  { tier: 6, credits: "400M", discount: "15.0%" },
                  { tier: 7, credits: "1B", discount: "20.0%" },
                  { tier: 8, credits: "2B", discount: "25.0%" }
                ].map((tier) => (
                  <div key={tier.tier} className="flex justify-between items-center bg-gray-800 rounded px-3 py-2">
                    <span className="text-yellow-400 font-medium">Tier {tier.tier}</span>
                    <span className="text-white">{tier.credits}</span>
                    <span className="text-green-400 font-medium">{tier.discount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Earn */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">How to Earn Credits</h3>
              <div className="text-sm text-gray-400 mb-3">
                Credits earned per $1 of volume traded (on open and close)
              </div>
              <div className="space-y-2">
                {[
                  { group: "Crypto", credits: 6 },
                  { group: "Stocks", credits: 7 },
                  { group: "Commodities 2", credits: 8 },
                  { group: "Indices", credits: 5 },
                  { group: "Commodities 1", credits: 5 },
                  { group: "Altcoins", credits: 2 },
                  { group: "FX Exotic", credits: 2 },
                  { group: "FX Minor", credits: 1.6 },
                  { group: "FX Major", credits: 1.2 }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-800 rounded px-3 py-2">
                    <span className="text-white">{item.group}</span>
                    <span className="text-blue-400 font-medium">{item.credits}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Links */}
            <div className="text-xs text-gray-400 text-center">
              <a href="https://medium.com/@gainsnetwork-io/introducing-gtrade-credits-trade-more-save-more-cb996ed536dc" className="text-blue-400 underline">
                Learn more here
              </a>
              . Still have questions? Ask in{" "}
              <a href="https://t.me/GainsNetwork" className="text-blue-400 underline">
                Telegram
              </a>
              .
            </div>
          </div>
        )}
      </div>
    </div>
  );
}