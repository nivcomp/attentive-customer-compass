
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Settings, Trash2 } from "lucide-react";

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

const CustomBoardsList = ({ 
  groupedBoards, 
  onDeleteBoard, 
  getBoardTypeLabel 
}: CustomBoardsListProps) => {
  if (Object.keys(groupedBoards).length === 0) return null;

  return (
    <div className="space-y-6">
      {Object.entries(groupedBoards).map(([type, typeBoards]) => (
        <div key={type}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {getBoardTypeLabel(type)}
            </h3>
            <Badge variant="outline" className="text-xs">
              {typeBoards.length} בורדים
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeBoards.map((board) => (
              <Card key={board.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-medium">
                        {board.name}
                      </CardTitle>
                      {board.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {board.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {getBoardTypeLabel(board.type)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-xs text-gray-500">
                      <p>שדות: {board.fields.length}</p>
                      <p>נוצר: {new Date(board.createdAt).toLocaleDateString('he-IL')}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            window.location.href = `/dynamic-boards?board=${board.id}`;
                          }}
                        >
                          <Eye className="h-3 w-3 ml-1" />
                          צפה
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            console.log('Edit board settings:', board.id);
                          }}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`האם אתה בטוח שברצונך למחוק את הבורד "${board.name}"?`)) {
                            onDeleteBoard(board.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomBoardsList;
