interface MexcBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MexcBottomNav({ activeTab, onTabChange }: MexcBottomNavProps) {
  const tabs = [
    { id: "trade", label: "Trade", icon: "fa-chart-line" },
    { id: "portfolio", label: "Portfolio", icon: "fa-briefcase" },
    { id: "stats", label: "Stats", icon: "fa-chart-bar" },
    { id: "leaderboard", label: "Rankings", icon: "fa-trophy" },
    { id: "profile", label: "Profile", icon: "fa-user" }
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