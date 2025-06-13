
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, LayoutGrid } from "lucide-react";
import { DynamicBoard } from "@/api/dynamicBoard";

interface DynamicBoardsListProps {
  boards: DynamicBoard[];
  selectedBoard: DynamicBoard | null;
  onSelectBoard: (board: DynamicBoard) => void;
  onCreateBoard: () => void;
}

const DynamicBoardsList = ({ 
  boards, 
  selectedBoard, 
  onSelectBoard, 
  onCreateBoard 
}: DynamicBoardsListProps) => {
  if (boards.length === 0) {
    return (
      <CardContent className="pt-0">
        <div className="text-center py-12">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              אין בורדים במערכת
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              צור את הבורד הראשון שלך כדי להתחיל לעבוד
            </p>
            <Button 
              onClick={onCreateBoard}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 ml-2" />
              צור בורד ראשון
            </Button>
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="pt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board, index) => (
          <Card 
            key={board.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-fade-in ${
              selectedBoard?.id === board.id 
                ? 'ring-2 ring-blue-500 shadow-md' 
                : 'hover:border-gray-300'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onSelectBoard(board)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-gray-900">
                {board.name}
              </CardTitle>
              {board.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {board.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>נוצר: {new Date(board.created_at).toLocaleDateString('he-IL')}</span>
                <Badge 
                  variant={selectedBoard?.id === board.id ? "default" : "outline"}
                  className="text-xs"
                >
                  {selectedBoard?.id === board.id ? 'נבחר' : 'לחץ לבחירה'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  );
};

export default DynamicBoardsList;
