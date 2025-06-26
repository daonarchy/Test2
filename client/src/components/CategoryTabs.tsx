import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "crypto", label: "Crypto" },
  { id: "stocks", label: "Stocks" },
  { id: "forex", label: "Forex" },
  { id: "commodities", label: "Commodities" },
];

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="px-4 py-3 trading-border border-b">
      <div className="flex space-x-1 trading-bg-secondary rounded-lg p-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            variant="ghost"
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === category.id
                ? "trading-bg-accent text-white"
                : "trading-text-gray hover:text-white"
            }`}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
