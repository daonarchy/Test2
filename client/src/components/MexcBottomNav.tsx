interface MexcBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MexcBottomNav({ activeTab, onTabChange }: MexcBottomNavProps) {
  const tabs = [
    { id: "futures", label: "Futures", icon: "fa-chart-line" },
    { id: "spot", label: "Spot", icon: "fa-exchange-alt" },
    { id: "markets", label: "Markets", icon: "fa-list" },
    { id: "orders", label: "Orders", icon: "fa-clipboard-list" },
    { id: "assets", label: "Assets", icon: "fa-wallet" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 ${
              activeTab === tab.id ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            <i className={`fas ${tab.icon} text-lg mb-1`}></i>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}