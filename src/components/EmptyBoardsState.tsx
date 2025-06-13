
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Plus } from "lucide-react";

interface EmptyBoardsStateProps {
  onCreateBoard: () => void;
}

const EmptyBoardsState = ({ onCreateBoard }: EmptyBoardsStateProps) => {
  return (
    <Card className="p-12 text-center">
      <div className="max-w-sm mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
          <LayoutGrid className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          אין בורדים
        </h3>
        <p className="text-gray-500 mb-6 text-sm">
          צור את הבורד הראשון שלך כדי להתחיל
        </p>
        <Button onClick={onCreateBoard} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          צור בורד ראשון
        </Button>
      </div>
    </Card>
  );
};

export default EmptyBoardsState;
