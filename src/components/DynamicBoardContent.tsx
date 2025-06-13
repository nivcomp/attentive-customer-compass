
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, Grid, Zap, Table, BarChart3 } from "lucide-react";
import { DynamicBoard, DynamicBoardColumn, DynamicBoardItem } from "@/api/dynamicBoard";
import { ViewType } from "./ViewSelector";
import DynamicBoardCardsView from "./DynamicBoardCardsView";
import DynamicBoardTableView from "./DynamicBoardTableView";
import SettingsManager from "./SettingsManager";
import DynamicBoardControls from "./DynamicBoardControls";
import AutomationTab from "./AutomationTab";

interface DynamicBoardContentProps {
  selectedBoard: DynamicBoard | null;
  columns: DynamicBoardColumn[];
  items: DynamicBoardItem[];
  filteredItems: DynamicBoardItem[];
  isLoading: boolean;
  searchQuery: string;
  currentView: ViewType;
  onSearchChange: (value: string) => void;
  onViewChange: (view: ViewType) => void;
  onCreateBoard: () => void;
  onRefresh?: () => void;
}

const DynamicBoardContent = ({ 
  selectedBoard, 
  columns, 
  items, 
  filteredItems, 
  isLoading, 
  searchQuery, 
  currentView, 
  onSearchChange, 
  onViewChange,
  onCreateBoard,
  onRefresh
}: DynamicBoardContentProps) => {
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
          <Button onClick={onCreateBoard} className="animate-scale-in">
            <Plus className="h-4 w-4 ml-2" />
            צור בורד חדש
          </Button>
        </div>
      </div>
    );
  }

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

      {/* Main Tabs */}
      <Tabs defaultValue="data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            נתונים
          </TabsTrigger>
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            אוטומציות
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            ניתוחים
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-6">
          {/* Controls */}
          <DynamicBoardControls
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            currentView={currentView}
            onViewChange={onViewChange}
            itemCount={filteredItems.length}
          />

          <Separator />

          {/* Content */}
          <div className="animate-fade-in">
            {currentView === 'table' && (
              <DynamicBoardTableView
                items={filteredItems}
                columns={columns}
                loading={isLoading}
                onEditItem={(item) => console.log('Edit item:', item)}
                onDeleteItem={(item) => console.log('Delete item:', item)}
                onAddItem={() => console.log('Add item')}
                boardId={selectedBoard.id}
                onRefresh={onRefresh}
              />
            )}
            
            {currentView === 'cards' && (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <DynamicBoardCardsView
                  items={filteredItems}
                  columns={columns}
                  onEditItem={(item) => console.log('Edit item:', item)}
                  onDeleteItem={(item) => console.log('Delete item:', item)}
                />
              </div>
            )}
            
            {currentView === 'kanban' && (
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
            
            {currentView === 'list' && (
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
        </TabsContent>

        <TabsContent value="automations">
          <AutomationTab 
            boardId={selectedBoard.id} 
            boardName={selectedBoard.name}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="bg-white rounded-lg border shadow-sm p-16 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">ניתוחים ודוחות</h3>
              <p className="text-sm text-gray-500">תכונות ניתוח יתווספו בהמשך</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DynamicBoardContent;
