
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";
import { useBoardSettings } from "@/hooks/useBoardSettings";
import { ViewType } from "./ViewSelector";
import { DynamicBoard } from "@/api/dynamicBoard";
import DynamicBoardHeader from "./DynamicBoardHeader";
import DynamicBoardsList from "./DynamicBoardsList";
import DynamicBoardContent from "./DynamicBoardContent";
import DynamicBoardLoadingSkeleton from "./DynamicBoardLoadingSkeleton";

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

  if (boardsLoading) {
    return <DynamicBoardLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200">
        <DynamicBoardHeader onCreateBoard={handleCreateBoard} />
        <DynamicBoardsList
          boards={boards}
          selectedBoard={selectedBoard}
          onSelectBoard={setSelectedBoard}
          onCreateBoard={handleCreateBoard}
        />
      </Card>

      <DynamicBoardContent
        selectedBoard={selectedBoard}
        columns={columns}
        items={items}
        filteredItems={filteredItems}
        isLoading={columnsLoading || itemsLoading}
        searchQuery={searchQuery}
        currentView={settings?.selectedView || 'table'}
        onSearchChange={handleSearchChange}
        onViewChange={handleViewChange}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  );
};

export default DynamicBoardBuilder;
