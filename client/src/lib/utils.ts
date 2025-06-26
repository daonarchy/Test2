import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  
  if (numPrice >= 1000) {
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (numPrice >= 1) {
    return numPrice.toFixed(2);
  } else {
    return numPrice.toFixed(4);
  }
}

export function formatChange(change: string | number): string {
  const numChange = typeof change === "string" ? parseFloat(change) : change;
  const sign = numChange >= 0 ? "+" : "";
  return `${sign}${numChange.toFixed(2)}%`;
}

export function formatVolume(volume: string | number): string {
  const numVolume = typeof volume === "string" ? parseFloat(volume) : volume;
  
  if (numVolume >= 1e9) {
    return `$${(numVolume / 1e9).toFixed(1)}B`;
  } else if (numVolume >= 1e6) {
    return `$${(numVolume / 1e6).toFixed(1)}M`;
  } else if (numVolume >= 1e3) {
    return `$${(numVolume / 1e3).toFixed(1)}K`;
  } else {
    return `$${numVolume.toFixed(2)}`;
  }
}

export function calculateLiquidationPrice(
  entryPrice: number,
  leverage: number,
  direction: "long" | "short"
): number {
  const liquidationMultiplier = direction === "long" ? 
    (1 - (1 / leverage)) : (1 + (1 / leverage));
  return entryPrice * liquidationMultiplier;
}

export function calculateMarginRequired(
  size: number,
  entryPrice: number,
  leverage: number
): number {
  return (size * entryPrice) / leverage;
}

export function calculatePositionSize(
  usdAmount: number,
  entryPrice: number
): number {
  return usdAmount / entryPrice;
}
