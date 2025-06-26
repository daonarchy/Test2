export interface OrderFormData {
  type: "market" | "limit";
  direction: "long" | "short";
  size: string;
  leverage: number;
  limitPrice?: string;
  takeProfit?: string;
  stopLoss?: string;
}

export interface PositionSummary {
  entryPrice: number;
  positionSize: number;
  marginRequired: number;
  liquidationPrice: number;
}

export interface TradeExecution {
  success: boolean;
  transactionHash?: string;
  order?: any;
  position?: any;
  error?: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}

export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

declare global {
  interface Window {
    TradingView: any;
  }
}
