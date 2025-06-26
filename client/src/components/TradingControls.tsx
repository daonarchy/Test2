import { Button } from "@/components/ui/button";

interface TradingControlsProps {
  onOpenTradingModal: (direction: "long" | "short") => void;
}

export default function TradingControls({ onOpenTradingModal }: TradingControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 trading-bg-secondary trading-border border-t p-4">
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => onOpenTradingModal("long")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors"
        >
          <i className="fas fa-arrow-up"></i>
          <span>Long</span>
        </Button>
        <Button
          onClick={() => onOpenTradingModal("short")}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors"
        >
          <i className="fas fa-arrow-down"></i>
          <span>Short</span>
        </Button>
      </div>
    </div>
  );
}
