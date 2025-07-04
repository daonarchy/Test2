// Gains Network supported collateral tokens configuration
export interface CollateralToken {
  symbol: string;
  name: string;
  icon: string;
  index: number; // Gains Network collateral index
  decimals: number;
  supportedChains: string[];
  minPositionUsd: number;
}

// Collateral mapping based on Gains Network documentation
export const COLLATERAL_TOKENS: Record<string, CollateralToken> = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    icon: "💰",
    index: 3, // Gains Network USDC index
    decimals: 6,
    supportedChains: ["arbitrum", "polygon", "base"],
    minPositionUsd: 7500, // Arbitrum minimum
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    icon: "🔸",
    index: 0, // Gains Network DAI index  
    decimals: 18,
    supportedChains: ["polygon", "arbitrum"],
    minPositionUsd: 1500, // Polygon minimum
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    icon: "⚡",
    index: 1, // Gains Network WETH index
    decimals: 18,
    supportedChains: ["arbitrum", "polygon"],
    minPositionUsd: 7500,
  },
  APE: {
    symbol: "APE",
    name: "ApeCoin",
    icon: "🦍",
    index: 2, // Gains Network APE index
    decimals: 18,
    supportedChains: ["arbitrum"],
    minPositionUsd: 7500,
  },
};

// Get supported collaterals for specific chain
export function getSupportedCollaterals(chainName: string): CollateralToken[] {
  return Object.values(COLLATERAL_TOKENS).filter(collateral =>
    collateral.supportedChains.includes(chainName)
  );
}

// Get default collateral for chain
export function getDefaultCollateral(chainName: string): CollateralToken {
  const supportedCollaterals = getSupportedCollaterals(chainName);
  
  // Chain-specific defaults based on Gains Network documentation
  switch (chainName) {
    case "polygon":
      return COLLATERAL_TOKENS.DAI;
    case "arbitrum":
    case "base":
    default:
      return COLLATERAL_TOKENS.USDC;
  }
}

// Get collateral by symbol
export function getCollateralBySymbol(symbol: string): CollateralToken | undefined {
  return COLLATERAL_TOKENS[symbol];
}

// Get collateral by index
export function getCollateralByIndex(index: number): CollateralToken | undefined {
  return Object.values(COLLATERAL_TOKENS).find(collateral => collateral.index === index);
}