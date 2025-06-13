
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings, Eye, Trash2, LayoutGrid } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import BoardCreator from "./BoardCreator";

interface CustomBoard {
  id: string;
  name: string;
  description?: string;
  type: string;
  fields: any[];
  createdAt: string;
}

const BoardManager = () => {
  const [customBoards, setCustomBoards] = useState<CustomBoard[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const { boards, loading } = useDynamicBoards();

  // טעינת בורדים מותאמים מ-localStorage
  useEffect(() => {
    const savedBoards = localStorage.getItem('customBoards');
    if (savedBoards) {
      try {
        setCustomBoards(JSON.parse(savedBoards));
      } catch (error) {
        console.error('Error loading custom boards:', error);
      }
    }
  }, []);

  const handleBoardCreated = (boardId: string) => {
    // רענון הרשימה
    const savedBoards = localStorage.getItem('customBoards');
    if (savedBoards) {
      try {
        setCustomBoards(JSON.parse(savedBoards));
      } catch (error) {
        console.error('Error loading custom boards:', error);
      }
    }
  };

  const deleteBoardSettings = (boardId: string) => {
    const updatedBoards = customBoards.filter(board => board.id !== boardId);
    setCustomBoards(updatedBoards);
    localStorage.setItem('customBoards', JSON.stringify(updatedBoards));
  };

  const getBoardTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      companies: 'חברות',
      contacts: 'אנשי קשר',
      deals: 'עסקאות',
      leads: 'לידים'
    };
    return types[type] || type;
  };

  const groupBoardsByType = () => {
    const grouped: Record<string, CustomBoard[]> = {};
    customBoards.forEach(board => {
      if (!grouped[board.type]) {
        grouped[board.type] = [];
      }
      grouped[board.type].push(board);
    });
    return grouped;
  };

  const groupedBoards = groupBoardsByType();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ניהול בורדים</h2>
          <p className="text-gray-600 mt-1">נהל את הבורדים המותאמים שלך</p>
        </div>
        <Button onClick={() => setShowCreator(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          בורד חדש
        </Button>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">סה"כ בורדים</p>
                <p className="text-xl font-bold">{boards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">בורדים מותאמים</p>
                <p className="text-xl font-bold">{customBoards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">סוגי בורדים</p>
                <p className="text-xl font-bold">{Object.keys(groupedBoards).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">נוצרו השבוע</p>
                <p className="text-xl font-bold">
                  {customBoards.filter(board => {
                    const created = new Date(board.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return created > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* בורדים מקובצים לפי סוג */}
      {Object.keys(groupedBoards).length > 0 ? (
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
                                // ניווט לבורד
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
                                // עריכת הגדרות בורד
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
                                deleteBoardSettings(board.id);
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
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              אין בורדים מותאמים
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              צור את הבורד המותאם הראשון שלך כדי להתחיל
            </p>
            <Button onClick={() => setShowCreator(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 ml-2" />
              צור בורד ראשון
            </Button>
          </div>
        </Card>
      )}

      {/* BoardCreator Modal */}
      {showCreator && (
        <BoardCreator
          onClose={() => setShowCreator(false)}
          onBoardCreated={handleBoardCreated}
        />
      )}
    </div>
  );
};

export default BoardManager;
