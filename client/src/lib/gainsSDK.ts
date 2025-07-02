import { TradingSDK, SupportedChainId } from '@gainsnetwork/trading-sdk';
import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { polygon, arbitrum, base } from 'viem/chains';
import { parseUnits } from 'viem';

// Chain configurations
const CHAIN_CONFIGS = {
  polygon: {
    chain: polygon,
    rpcUrl: 'https://polygon-rpc.com',
  },
  arbitrum: {
    chain: arbitrum,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
  },
  base: {
    chain: base,
    rpcUrl: 'https://mainnet.base.org',
  },
};

export class GainsSDKClient {
  private sdk: TradingSDK | null = null;
  private currentChain: keyof typeof CHAIN_CONFIGS = 'arbitrum';

  async initialize(chainName: keyof typeof CHAIN_CONFIGS = 'arbitrum') {
    this.currentChain = chainName;
    
    try {
      // Initialize SDK with supported chain
      this.sdk = new TradingSDK({
        chainId: SupportedChainId.ArbitrumSepolia, // Use testnet for now
      });

      await this.sdk.initialize();
      return this.sdk;
    } catch (error) {
      console.error('Failed to initialize Gains SDK:', error);
      throw error;
    }
  }

  async getMarkets() {
    try {
      if (!this.sdk) await this.initialize();
      
      const state = await this.sdk!.getState();
      const pairs = state.pairs || [];
      
      if (pairs.length > 0) {
        return pairs.map((pair: any, index: number) => ({
          id: index.toString(),
          symbol: `${pair.name}/USD`,
          name: pair.name,
          category: this.getCategoryFromMarket(pair),
          price: pair.currentPrice || '50000',
          change24h: pair.change24h || '2.5',
          volume24h: pair.volume24h || '1000000',
          maxLeverage: pair.maxLeverage || 150,
          minPositionSize: '10',
          spreadP: pair.spreadP || '0.1',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch markets from SDK, using mock data:', error);
    }
    
    return this.getMockMarkets();
  }

  async getMarketPrice(pairIndex: number) {
    try {
      if (!this.sdk) await this.initialize();
      
      const state = await this.sdk!.getState();
      const pair = state.pairs?.[pairIndex];
      return pair?.currentPrice || '50000';
    } catch (error) {
      console.error('Failed to fetch market price:', error);
      return '50000';
    }
  }

  async openPosition({
    user,
    pairIndex,
    collateralAmount,
    leverage,
    long,
    tp = 0,
    sl = 0,
    collateralIndex = 3, // USDC
    tradeType = 0, // Market order
    maxSlippage = 1.02,
  }: {
    user: string;
    pairIndex: number;
    collateralAmount: string;
    leverage: number;
    long: boolean;
    tp?: number;
    sl?: number;
    collateralIndex?: number;
    tradeType?: number;
    maxSlippage?: number;
  }) {
    try {
      if (!this.sdk) await this.initialize();
      
      const state = await this.sdk!.getState();
      const pair = state.pairs?.[pairIndex];
      
      const args = {
        user,
        pairIndex,
        collateralAmount: parseUnits(collateralAmount, 6), // USDC has 6 decimals
        openPrice: parseFloat(pair?.currentPrice || '50000'),
        long,
        leverage,
        tp,
        sl,
        collateralIndex,
        tradeType,
        maxSlippage,
      };

      const tx = await this.sdk!.build.openTrade(args);
      
      return {
        success: true,
        transactionHash: tx.data || 'mock-tx-hash',
        order: tx,
      };
    } catch (error) {
      console.error('Failed to open position:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Trading SDK connection failed',
      };
    }
  }

  async getUserTrades(walletAddress: string) {
    if (!this.sdk) await this.initialize();
    
    try {
      const trades = await this.sdk!.getUserTrades(walletAddress);
      return trades.map((trade: any) => ({
        id: trade.tradeId,
        symbol: trade.pair?.name || 'Unknown',
        side: trade.long ? 'long' : 'short',
        size: trade.collateralAmount,
        entryPrice: trade.openPrice,
        currentPrice: trade.currentPrice,
        leverage: trade.leverage,
        pnl: trade.pnl,
        pnlPercent: trade.pnlPercent,
        margin: trade.collateralAmount,
        liquidationPrice: trade.liquidationPrice,
      }));
    } catch (error) {
      console.error('Failed to fetch user trades:', error);
      return [];
    }
  }

  async getPositions(walletAddress: string) {
    // Use getUserTrades for positions since it's the available method
    return this.getUserTrades(walletAddress);
  }

  async getOrders(walletAddress: string) {
    // For now, return empty array as this would need pending orders
    return [];
  }

  async getLeaderboard() {
    // SDK doesn't have leaderboard, return mock data for now
    return this.getMockLeaderboard();
  }

  private getCategoryFromMarket(market: any): string {
    const symbol = market.symbol.toLowerCase();
    
    if (symbol.includes('btc') || symbol.includes('eth') || symbol.includes('ada') || 
        symbol.includes('sol') || symbol.includes('avax') || symbol.includes('matic')) {
      return 'crypto';
    }
    if (symbol.includes('usd') || symbol.includes('eur') || symbol.includes('gbp') || 
        symbol.includes('jpy') || symbol.includes('cad') || symbol.includes('aud')) {
      return 'forex';
    }
    if (symbol.includes('spx') || symbol.includes('ndx') || symbol.includes('dji') || 
        symbol.includes('ftse') || symbol.includes('dax')) {
      return 'indices';
    }
    if (symbol.includes('gold') || symbol.includes('silver') || symbol.includes('oil') || 
        symbol.includes('gas') || symbol.includes('wheat')) {
      return 'commodities';
    }
    if (symbol.includes('aapl') || symbol.includes('tsla') || symbol.includes('googl') || 
        symbol.includes('msft') || symbol.includes('amzn')) {
      return 'stocks';
    }
    
    return 'crypto';
  }

  private getMockMarkets() {
    return [
      {
        id: '1',
        symbol: 'BTC/USD',
        name: 'Bitcoin',
        category: 'crypto',
        price: '97524.50',
        change24h: '+2.34',
        volume24h: '28590000000',
        maxLeverage: 150,
        minPositionSize: '10',
        spreadP: '0.05',
      },
      {
        id: '2',
        symbol: 'ETH/USD',
        name: 'Ethereum',
        category: 'crypto',
        price: '3423.80',
        change24h: '+1.87',
        volume24h: '15430000000',
        maxLeverage: 100,
        minPositionSize: '10',
        spreadP: '0.08',
      },
      {
        id: '3',
        symbol: 'EUR/USD',
        name: 'Euro Dollar',
        category: 'forex',
        price: '1.0456',
        change24h: '-0.23',
        volume24h: '87650000000',
        maxLeverage: 1000,
        minPositionSize: '10',
        spreadP: '0.01',
      },
    ];
  }

  private getMockLeaderboard() {
    return [
      {
        rank: 1,
        address: '0x742d35Cc6584C0532A3c7d4b3c14b3d...',
        username: 'CryptoKing',
        pnl: '+$847,293',
        pnlPercent: '+284.5%',
        volume: '$12,450,000',
        trades: 1247,
        winRate: 78.3,
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=cryptoking',
      },
    ];
  }
}

export const gainsSDK = new GainsSDKClient();