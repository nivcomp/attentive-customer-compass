
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid } from "lucide-react";

interface EmptyBoardsStateProps {
  onCreateBoard: () => void;
}

const EmptyBoardsState = React.memo<EmptyBoardsStateProps>(({ onCreateBoard }) => {
  return (
    <Card>
      <CardContent className="pt-12 pb-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
            <LayoutGrid className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            אין עדיין בורדים במערכת
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            צור את הבורד הראשון שלך כדי להתחיל לעבוד עם הנתונים
          </p>
          <Button onClick={onCreateBoard} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 ml-2" />
            צור בורד חדש
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

EmptyBoardsState.displayName = 'EmptyBoardsState';

export default EmptyBoardsState;
