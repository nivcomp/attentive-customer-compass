
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye } from "lucide-react";

interface CustomBoard {
  id: string;
  name: string;
  description?: string;
  type: string;
  fields: any[];
  createdAt: string;
}

interface VirtualizedBoardsListProps {
  groupedBoards: Record<string, CustomBoard[]>;
  onDeleteBoard: (boardId: string) => void;
  getBoardTypeLabel: (type: string) => string;
  maxItemsPerGroup?: number;
}

const VirtualizedBoardsList = React.memo<VirtualizedBoardsListProps>(({ 
  groupedBoards, 
  onDeleteBoard, 
  getBoardTypeLabel,
  maxItemsPerGroup = 50 // Limit items for performance
}) => {
  const hasCustomBoards = Object.keys(groupedBoards).length > 0;

  // Memoize board rendering to prevent unnecessary re-renders
  const boardGroups = useMemo(() => {
    return Object.entries(groupedBoards).map(([type, boards]) => ({
      type,
      boards: boards.slice(0, maxItemsPerGroup), // Limit for performance
      totalCount: boards.length,
      hasMore: boards.length > maxItemsPerGroup
    }));
  }, [groupedBoards, maxItemsPerGroup]);

  if (!hasCustomBoards) {
    return null;
  }

  return (
    <div className="space-y-6">
      {boardGroups.map(({ type, boards, totalCount, hasMore }) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getBoardTypeLabel(type)} ({totalCount})</span>
              {hasMore && (
                <Badge variant="secondary" className="text-xs">
                  מציג {boards.length} מתוך {totalCount}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onDeleteBoard={onDeleteBoard}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

// Separate memoized component for individual board cards
const BoardCard = React.memo<{
  board: CustomBoard;
  onDeleteBoard: (boardId: string) => void;
}>(({ board, onDeleteBoard }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
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
  );
});

VirtualizedBoardsList.displayName = 'VirtualizedBoardsList';
BoardCard.displayName = 'BoardCard';

export default VirtualizedBoardsList;
