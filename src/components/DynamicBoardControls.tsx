
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import ViewSelector, { ViewType } from "./ViewSelector";

interface DynamicBoardControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  itemCount: number;
}

const DynamicBoardControls = ({ 
  searchQuery, 
  onSearchChange, 
  currentView, 
  onViewChange, 
  itemCount 
}: DynamicBoardControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="חפש בנתונים..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 border-gray-200 focus:border-blue-300 focus:ring-blue-100 transition-colors"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-4 w-4 ml-2" />
          פילטרים
        </Button>
      </div>
      
      <ViewSelector
        currentView={currentView}
        onViewChange={onViewChange}
        itemCount={itemCount}
      />
    </div>
  );
};

export default DynamicBoardControls;
