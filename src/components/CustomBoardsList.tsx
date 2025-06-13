
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Eye } from "lucide-react";

interface CustomBoard {
  id: string;
  name: string;
  description?: string;
  type: string;
  fields: any[];
  createdAt: string;
}

interface CustomBoardsListProps {
  groupedBoards: Record<string, CustomBoard[]>;
  onDeleteBoard: (boardId: string) => void;
  getBoardTypeLabel: (type: string) => string;
}

const CustomBoardsList = React.memo<CustomBoardsListProps>(({ 
  groupedBoards, 
  onDeleteBoard, 
  getBoardTypeLabel 
}) => {
  const hasCustomBoards = Object.keys(groupedBoards).length > 0;

  if (!hasCustomBoards) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedBoards).map(([type, boards]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle>
              {getBoardTypeLabel(type)} ({boards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {board.name}
                      </h3>
                      {board.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {board.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {board.fields.length} שדות
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(board.createdAt).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteBoard(board.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

CustomBoardsList.displayName = 'CustomBoardsList';

export default CustomBoardsList;
