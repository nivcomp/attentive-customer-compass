
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Search, Filter } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";
import ViewSelector, { ViewType } from "./ViewSelector";
import DynamicBoardCardsView from "./DynamicBoardCardsView";
import { DynamicBoard } from "@/api/dynamicBoard";

const DynamicBoardBuilder = () => {
  const { boards, loading: boardsLoading, createBoard } = useDynamicBoards();
  const [selectedBoard, setSelectedBoard] = useState<DynamicBoard | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('table');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { columns, loading: columnsLoading } = useDynamicBoardColumns(selectedBoard?.id || null);
  const { items, loading: itemsLoading } = useDynamicBoardItems(selectedBoard?.id || null);

  // פילטר פריטים לפי חיפוש
  const filteredItems = items.filter(item => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return Object.values(item.data).some(value => 
      String(value).toLowerCase().includes(query)
    );
  });

  const handleCreateBoard = async () => {
    const name = prompt('שם הבורד החדש:');
    if (name) {
      const newBoard = await createBoard({ name, description: '' });
      if (newBoard) {
        setSelectedBoard(newBoard);
      }
    }
  };

  const renderBoardContent = () => {
    if (!selectedBoard) {
      return (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <div className="text-lg mb-2">בחר בורד לעריכה או צור חדש</div>
          </div>
          <Button onClick={handleCreateBoard}>
            <Plus className="h-4 w-4 ml-2" />
            צור בורד חדש
          </Button>
        </div>
      );
    }

    if (columnsLoading || itemsLoading) {
      return <div className="text-center py-8">טוען נתונים...</div>;
    }

    return (
      <div className="space-y-4">
        {/* כלי בקרה */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="חפש בנתונים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-2" />
              פילטרים
            </Button>
          </div>
          
          <ViewSelector
            currentView={currentView}
            onViewChange={setCurrentView}
            itemCount={filteredItems.length}
          />
        </div>

        {/* תוכן הבורד */}
        <div className="border rounded-lg p-4 bg-card">
          {currentView === 'table' && (
            <div className="text-center py-8 text-muted-foreground">
              תצוגת טבלה - יתווסף בהמשך
            </div>
          )}
          
          {currentView === 'cards' && (
            <DynamicBoardCardsView
              items={filteredItems}
              columns={columns}
              onEditItem={(item) => console.log('Edit item:', item)}
              onDeleteItem={(item) => console.log('Delete item:', item)}
            />
          )}
          
          {currentView === 'kanban' && (
            <div className="text-center py-8 text-muted-foreground">
              תצוגת קנבן - יתווסף בהמשך
            </div>
          )}
          
          {currentView === 'list' && (
            <div className="text-center py-8 text-muted-foreground">
              תצוגת רשימה - יתווסף בהמשך
            </div>
          )}
        </div>
      </div>
    );
  };

  if (boardsLoading) {
    return <div className="text-center py-8">טוען בורדים...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>בורדים דינמיים</span>
            <Button onClick={handleCreateBoard} size="sm">
              <Plus className="h-4 w-4 ml-2" />
              בורד חדש
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {boards.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <div className="text-lg mb-2">אין בורדים במערכת</div>
                <div className="text-sm">צור את הבורד הראשון שלך</div>
              </div>
              <Button onClick={handleCreateBoard}>
                <Plus className="h-4 w-4 ml-2" />
                צור בורד ראשון
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board) => (
                <Card 
                  key={board.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBoard?.id === board.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedBoard(board)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{board.name}</CardTitle>
                    {board.description && (
                      <p className="text-sm text-muted-foreground">
                        {board.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>נוצר: {new Date(board.created_at).toLocaleDateString('he-IL')}</span>
                      <Badge variant="outline">
                        {selectedBoard?.id === board.id ? 'נבחר' : 'לחץ לבחירה'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {renderBoardContent()}
    </div>
  );
};

export default DynamicBoardBuilder;
