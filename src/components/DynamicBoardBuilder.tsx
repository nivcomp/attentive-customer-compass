
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";
import { useBoardSettings } from "@/hooks/useBoardSettings";
import { useBoardGroups } from "@/hooks/useBoardGroups";
import { ViewType } from "./ViewSelector";
import { DynamicBoard } from "@/api/dynamicBoard";
import DynamicBoardHeader from "./DynamicBoardHeader";
import DynamicBoardsList from "./DynamicBoardsList";
import DynamicBoardContent from "./DynamicBoardContent";
import DynamicBoardLoadingSkeleton from "./DynamicBoardLoadingSkeleton";
import RelationshipManager from "./RelationshipManager";
import BoardGroupManager from "./BoardGroupManager";
import GroupedBoardView from "./GroupedBoardView";

const DynamicBoardBuilder = () => {
  const { boards, loading: boardsLoading, createBoard } = useDynamicBoards();
  const [selectedBoard, setSelectedBoard] = useState<DynamicBoard | null>(null);
  const [showRelationshipManager, setShowRelationshipManager] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [viewMode, setViewMode] = useState<'boards' | 'groups'>('boards');
  
  const { settings: groupSettings, selectGroup } = useBoardGroups();
  const selectedGroup = groupSettings.groups.find(g => g.id === groupSettings.selectedGroupId);

  const { settings, saveSettings } = useBoardSettings(selectedBoard?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { columns, loading: columnsLoading } = useDynamicBoardColumns(selectedBoard?.id || null);
  const { items, loading: itemsLoading, refetch } = useDynamicBoardItems(selectedBoard?.id || null);

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

  const handleShowAllBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setSelectedBoard(board);
      setViewMode('boards');
    }
  };

  const handleGroupSelect = (groupId: string) => {
    selectGroup(groupId);
    setViewMode('groups');
    setSelectedBoard(null);
  };

  if (boardsLoading) {
    return <DynamicBoardLoadingSkeleton />;
  }

  // תצוגת קבוצה
  if (viewMode === 'groups' && selectedGroup) {
    return (
      <div className="space-y-6">
        <Card className="shadow-sm border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setViewMode('boards');
                    selectGroup(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  חזור לבורדים
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">תצוגת קבוצה</h1>
                  <p className="text-gray-600">מציג בורדים בתצוגה מקובצת</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowGroupManager(true)}
                >
                  <Users className="h-4 w-4 ml-2" />
                  נהל קבוצות
                </Button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {groupSettings.groups.map(group => (
                <Button
                  key={group.id}
                  variant={group.id === selectedGroup.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGroupSelect(group.id)}
                >
                  {group.name}
                  <Badge variant="secondary" className="mr-2 text-xs">
                    {group.boardIds.length}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <GroupedBoardView
          group={selectedGroup}
          boards={boards}
          onShowAllBoard={handleShowAllBoard}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200">
        <DynamicBoardHeader 
          onCreateBoard={handleCreateBoard}
          onManageRelationships={() => setShowRelationshipManager(true)}
        />
        
        {/* הוספת כפתורי ניהול קבוצות */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowGroupManager(true)}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Users className="h-4 w-4 ml-2" />
              נהל קבוצות
            </Button>
            
            {groupSettings.groups.length > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-500">קבוצות זמינות:</span>
                {groupSettings.groups.map(group => (
                  <Button
                    key={group.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleGroupSelect(group.id)}
                  >
                    {group.name}
                    <Badge variant="secondary" className="mr-2 text-xs">
                      {group.boardIds.length}
                    </Badge>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

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
        onRefresh={refetch}
      />

      {/* BoardGroupManager Modal */}
      <BoardGroupManager
        boards={boards}
        isOpen={showGroupManager}
        onClose={() => setShowGroupManager(false)}
      />

      {/* RelationshipManager Modal */}
      <RelationshipManager
        isOpen={showRelationshipManager}
        onClose={() => setShowRelationshipManager(false)}
      />
    </div>
  );
};

export default DynamicBoardBuilder;
