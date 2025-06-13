
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, Shield } from "lucide-react";
import { Board } from "@/api/boards";

interface RegularBoardsListProps {
  boards: Board[];
  selectedBoardForPermissions: string | null;
  onTogglePermissions: (boardId: string) => void;
}

const RegularBoardsList = React.memo<RegularBoardsListProps>(({ 
  boards, 
  selectedBoardForPermissions, 
  onTogglePermissions 
}) => {
  if (boards.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          בורדים רגילים ({boards.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {boards.map((board) => (
            <div
              key={board.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{board.name}</h3>
                {board.description && (
                  <p className="text-sm text-gray-500 mt-1">{board.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {board.visibility}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(board.created_at).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTogglePermissions(board.id)}
                  className={selectedBoardForPermissions === board.id ? 'bg-blue-50' : ''}
                >
                  <Users className="h-4 w-4 mr-1" />
                  הרשאות
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

RegularBoardsList.displayName = 'RegularBoardsList';

export default RegularBoardsList;
