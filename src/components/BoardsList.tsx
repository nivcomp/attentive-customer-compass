
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Board as APIBoard } from "@/api/boards";

interface BoardsListProps {
  boards: APIBoard[];
  selectedBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
}

const BoardsList: React.FC<BoardsListProps> = ({
  boards,
  selectedBoardId,
  onSelectBoard,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>הלוחות שלי</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {boards.map((board) => (
            <div
              key={board.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedBoardId === board.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectBoard(board.id)}
            >
              <div className="font-medium">{board.name}</div>
              {board.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {board.description}
                </div>
              )}
            </div>
          ))}
          {boards.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              אין לוחות זמינים
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BoardsList;
