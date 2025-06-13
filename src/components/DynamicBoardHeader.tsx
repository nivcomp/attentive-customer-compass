
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Link2 } from "lucide-react";

interface DynamicBoardHeaderProps {
  onCreateBoard: () => void;
  onManageRelationships?: () => void;
}

const DynamicBoardHeader: React.FC<DynamicBoardHeaderProps> = ({ 
  onCreateBoard, 
  onManageRelationships 
}) => {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            בורדים דינמיים
          </CardTitle>
          <p className="text-gray-600 mt-1">
            צור ונהל בורדים מותאמים אישית לצרכים שלך
          </p>
        </div>
        <div className="flex gap-2">
          {onManageRelationships && (
            <Button 
              onClick={onManageRelationships}
              variant="outline"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Link2 className="h-4 w-4 ml-2" />
              נהל קשרים
            </Button>
          )}
          <Button 
            onClick={onCreateBoard}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 ml-2" />
            בורד חדש
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default DynamicBoardHeader;
