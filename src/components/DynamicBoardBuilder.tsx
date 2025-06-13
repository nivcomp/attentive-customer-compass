
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings, Search, Filter, Grid, LayoutGrid } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";
import { useBoardSettings } from "@/hooks/useBoardSettings";
import ViewSelector, { ViewType } from "./ViewSelector";
import DynamicBoardCardsView from "./DynamicBoardCardsView";
import DynamicBoardTableView from "./DynamicBoardTableView";
import SettingsManager from "./SettingsManager";
import { DynamicBoard } from "@/api/dynamicBoard";

const DynamicBoardBuilder = () => {
  const { boards, loading: boardsLoading, createBoard } = useDynamicBoards();
  const [selectedBoard, setSelectedBoard] = useState<DynamicBoard | null>(null);
  
  const { settings, saveSettings } = useBoardSettings(selectedBoard?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { columns, loading: columnsLoading } = useDynamicBoardColumns(selectedBoard?.id || null);
  const { items, loading: itemsLoading } = useDynamicBoardItems(selectedBoard?.id || null);

  // סנכרון חיפוש עם הגדרות
  useEffect(() => {
    if (settings?.searchQuery !== undefined) {
      setSearchQuery(settings.searchQuery);
    }
  }, [settings?.searchQuery]);

  // שמירת שינויים בחיפוש
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (settings) {
      saveSettings({ searchQuery: value });
    }
  };

  // שמירת שינויים בתצוגה
  const handleViewChange = (view: ViewType) => {
    if (settings) {
      saveSettings({ selectedView: view });
    }
  };

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
        <div className="text-center py-16 px-6">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ברוכים הבאים לבורדים דינמיים
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              בחר בורד קיים לעריכה או צור בורד חדש כדי להתחיל
            </p>
            <Button onClick={handleCreateBoard} className="animate-scale-in">
              <Plus className="h-4 w-4 ml-2" />
              צור בורד חדש
            </Button>
          </div>
        </div>
      );
    }

    const isLoading = columnsLoading || itemsLoading;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-lg border shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {selectedBoard.name}
            </h2>
            {selectedBoard.description && (
              <p className="text-sm text-gray-500">{selectedBoard.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {filteredItems.length} פריטים
            </Badge>
            <SettingsManager boardId={selectedBoard.id} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="חפש בנתונים..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pr-10 border-gray-200 focus:border-blue-300 focus:ring-blue-100 transition-colors"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 ml-2" />
              פילטרים
            </Button>
          </div>
          
          <ViewSelector
            currentView={settings?.selectedView || 'table'}
            onViewChange={handleViewChange}
            itemCount={filteredItems.length}
          />
        </div>

        <Separator />

        {/* Content */}
        <div className="animate-fade-in">
          {(settings?.selectedView || 'table') === 'table' && (
            <DynamicBoardTableView
              items={filteredItems}
              columns={columns}
              loading={isLoading}
              onEditItem={(item) => console.log('Edit item:', item)}
              onDeleteItem={(item) => console.log('Delete item:', item)}
              onAddItem={() => console.log('Add item')}
            />
          )}
          
          {(settings?.selectedView || 'table') === 'cards' && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <DynamicBoardCardsView
                items={filteredItems}
                columns={columns}
                onEditItem={(item) => console.log('Edit item:', item)}
                onDeleteItem={(item) => console.log('Delete item:', item)}
              />
            </div>
          )}
          
          {(settings?.selectedView || 'table') === 'kanban' && (
            <div className="bg-white rounded-lg border shadow-sm p-16 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Grid className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">תצוגת קנבן</h3>
                <p className="text-sm text-gray-500">תצוגה זו תתווסף בהמשך</p>
              </div>
            </div>
          )}
          
          {(settings?.selectedView || 'table') === 'list' && (
            <div className="bg-white rounded-lg border shadow-sm p-16 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Grid className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">תצוגת רשימה</h3>
                <p className="text-sm text-gray-500">תצוגה זו תתווסף בהמשך</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 rtl:space-x-reverse p-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  if (boardsLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <LoadingSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <LayoutGrid className="h-4 w-4 text-white" />
              </div>
              <span>בורדים דינמיים</span>
            </div>
            <Button 
              onClick={handleCreateBoard} 
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 ml-2" />
              בורד חדש
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {boards.length === 0 ? (
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
                  onClick={handleCreateBoard}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  צור בורד ראשון
                </Button>
              </div>
            </div>
          ) : (
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
                  onClick={() => setSelectedBoard(board)}
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
          )}
        </CardContent>
      </Card>

      {renderBoardContent()}
    </div>
  );
};

export default DynamicBoardBuilder;
