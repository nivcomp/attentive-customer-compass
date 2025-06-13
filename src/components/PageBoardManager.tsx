import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  FolderOpen, 
  Settings,
  Copy,
  Trash2,
  Eye,
  Link,
  Link2,
  Zap
} from "lucide-react";
import CustomBoardBuilder from "./CustomBoardBuilder";
import RelationshipBuilder from "./RelationshipBuilder";
import RelationshipManager from "./RelationshipManager";
import AutomationTab from "./AutomationTab";

interface PageBoard {
  id: string;
  name: string;
  description?: string;
  color: string;
  columns: any[];
  shared: boolean;
  pageIds: string[];
  createdAt: string;
}

interface PageBoardManagerProps {
  pageId: string;
  pageName: string;
}

const PageBoardManager: React.FC<PageBoardManagerProps> = ({ pageId, pageName }) => {
  const [boards, setBoards] = useState<PageBoard[]>([]);
  const [showBoardBuilder, setShowBoardBuilder] = useState(false);
  const [showSharedBoards, setShowSharedBoards] = useState(false);
  const [showRelationshipManager, setShowRelationshipManager] = useState(false);
  const [showAutomations, setShowAutomations] = useState<string | null>(null);

  // Mock shared boards data
  const [sharedBoards] = useState<PageBoard[]>([
    {
      id: 'shared-1',
      name: 'משימות כלליות',
      description: 'בורד משותף לכל הדפים',
      color: '#3B82F6',
      columns: [
        { name: 'משימה', type: 'text' },
        { name: 'סטטוס', type: 'status' },
        { name: 'אחראי', type: 'select' }
      ],
      shared: true,
      pageIds: ['page-1', 'page-2', 'page-3'],
      createdAt: '2024-01-15'
    },
    {
      id: 'shared-2',
      name: 'לקוחות משותפים',
      description: 'בסיס נתונים של לקוחות',
      color: '#10B981',
      columns: [
        { name: 'שם הלקוח', type: 'text' },
        { name: 'טלפון', type: 'text' },
        { name: 'אימייל', type: 'text' }
      ],
      shared: true,
      pageIds: ['contacts', 'deals', 'leads'],
      createdAt: '2024-01-10'
    }
  ]);

  const handleCreateBoard = (boardData: any) => {
    const newBoard: PageBoard = {
      id: Date.now().toString(),
      name: boardData.name,
      description: boardData.description,
      color: boardData.color,
      columns: boardData.columns,
      shared: false,
      pageIds: [pageId],
      createdAt: new Date().toISOString()
    };
    
    setBoards([...boards, newBoard]);
    console.log('New board created for page:', pageName, newBoard);
  };

  const handleDuplicateBoard = (board: PageBoard, withData: boolean = false) => {
    const duplicatedBoard: PageBoard = {
      ...board,
      id: Date.now().toString(),
      name: `${board.name} - עותק`,
      shared: false,
      pageIds: [pageId],
      createdAt: new Date().toISOString()
    };
    
    setBoards([...boards, duplicatedBoard]);
    console.log(`Board duplicated ${withData ? 'with data' : 'structure only'}:`, duplicatedBoard.name);
  };

  const handleAddSharedBoard = (sharedBoard: PageBoard) => {
    // Add current page to the shared board's pageIds
    const updatedBoard = {
      ...sharedBoard,
      pageIds: [...sharedBoard.pageIds, pageId]
    };
    
    setBoards([...boards, updatedBoard]);
    console.log('Shared board added to page:', pageName, updatedBoard.name);
  };

  const handleRemoveBoard = (boardId: string) => {
    setBoards(boards.filter(board => board.id !== boardId));
    console.log('Board removed from page:', pageName);
  };

  const pageBoards = boards.filter(board => board.pageIds.includes(pageId));
  const availableSharedBoards = sharedBoards.filter(board => !board.pageIds.includes(pageId));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          בורדים של {pageName}
        </h4>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowRelationshipManager(true)}
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Link2 className="h-4 w-4 mr-2" />
            ניהול קישורים
          </Button>
          
          <RelationshipBuilder 
            onRelationshipCreated={(relationship) => {
              console.log('New relationship created:', relationship);
            }}
          />
          
          <Dialog open={showSharedBoards} onOpenChange={setShowSharedBoards}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Link className="h-4 w-4 mr-2" />
                הוסף בורד משותף
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>הוסף בורד משותף לדף</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {availableSharedBoards.map((board) => (
                  <Card key={board.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: board.color }}
                        />
                        <div>
                          <h5 className="font-semibold">{board.name}</h5>
                          <p className="text-sm text-gray-600">{board.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {board.columns.length} עמודות
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              משותף בין {board.pageIds.length} דפים
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          handleAddSharedBoard(board);
                          setShowSharedBoards(false);
                        }}
                      >
                        הוסף לדף
                      </Button>
                    </div>
                  </Card>
                ))}
                {availableSharedBoards.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    כל הבורדים המשותפים כבר קיימים בדף זה
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <CustomBoardBuilder
            isOpen={showBoardBuilder}
            onOpenChange={setShowBoardBuilder}
            onCreateBoard={handleCreateBoard}
          />
          <Button
            onClick={() => setShowBoardBuilder(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            בורד חדש
          </Button>
        </div>
      </div>

      {/* Page Boards List */}
      <div className="space-y-3">
        {pageBoards.map((board) => (
          <Card key={board.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: board.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold">{board.name}</h5>
                    {board.shared && (
                      <Badge variant="outline" className="text-xs">
                        <Link className="h-3 w-3 mr-1" />
                        משותף
                      </Badge>
                    )}
                  </div>
                  {board.description && (
                    <p className="text-sm text-gray-600">{board.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {board.columns.length} עמודות
                    </Badge>
                    <span className="text-xs text-gray-500">
                      נוצר ב-{new Date(board.createdAt).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAutomations(board.id)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Zap className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>שכפל בורד</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>איך תרצה לשכפל את הבורד "{board.name}"?</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDuplicateBoard(board, false)}
                          className="flex-1"
                        >
                          שכפל מבנה בלבד
                        </Button>
                        <Button
                          onClick={() => handleDuplicateBoard(board, true)}
                          className="flex-1"
                        >
                          שכפל עם נתונים
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {!board.shared && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBoard(board.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {pageBoards.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">אין בורדים בדף זה</p>
              <p className="text-xs">צור בורד חדש או הוסף בורד משותף כדי להתחיל</p>
            </div>
          </Card>
        )}
      </div>

      {/* Relationship Manager Modal */}
      <RelationshipManager 
        isOpen={showRelationshipManager}
        onClose={() => setShowRelationshipManager(false)}
      />

      {/* Automation Manager Modal */}
      <Dialog open={!!showAutomations} onOpenChange={() => setShowAutomations(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              אוטומציות לבורד
            </DialogTitle>
          </DialogHeader>
          {showAutomations && (
            <AutomationTab 
              boardId={showAutomations}
              boardName={pageBoards.find(b => b.id === showAutomations)?.name || 'בורד'}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageBoardManager;
