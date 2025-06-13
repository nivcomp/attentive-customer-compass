
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LayoutGrid } from "lucide-react";

interface DynamicBoardHeaderProps {
  onCreateBoard: () => void;
}

const DynamicBoardHeader = ({ onCreateBoard }: DynamicBoardHeaderProps) => {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between text-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <span>בורדים דינמיים</span>
        </div>
        <Button 
          onClick={onCreateBoard} 
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4 ml-2" />
          בורד חדש
        </Button>
      </CardTitle>
    </CardHeader>
  );
};

export default DynamicBoardHeader;
