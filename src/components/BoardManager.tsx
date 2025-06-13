
import React, { Suspense, lazy } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useOptimizedBoardData } from "@/hooks/useOptimizedBoardData";
import { useOptimizedPermissions } from "@/hooks/useOptimizedPermissions";
import BoardManagerSkeleton from "./BoardManagerSkeleton";
import BoardManagerStats from "./BoardManagerStats";
import RegularBoardsList from "./RegularBoardsList";
import EmptyBoardsState from "./EmptyBoardsState";

// Lazy load components that might not be immediately needed
const BoardCreator = lazy(() => import("./BoardCreator"));
const BoardPermissionsManager = lazy(() => import("./BoardPermissionsManager"));
const VirtualizedBoardsList = lazy(() => import("./VirtualizedBoardsList"));

const BoardManager = () => {
  const [showCreator, setShowCreator] = React.useState(false);
  
  const {
    customBoards,
    dynamicBoards,
    regularBoards,
    totalBoards,
    regularBoardsCount,
    dynamicBoardsCount,
    customBoardsCount,
    groupBoardsByType,
    loading,
    handleBoardCreated,
    deleteBoardSettings,
    getBoardTypeLabel,
  } = useOptimizedBoardData();

  const {
    selectedBoardForPermissions,
    handleTogglePermissions,
  } = useOptimizedPermissions();

  const handleBoardCreatedAndClose = React.useCallback((boardId: string) => {
    handleBoardCreated(boardId);
    setShowCreator(false);
  }, [handleBoardCreated]);

  if (loading) {
    return <BoardManagerSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ניהול בורדים</h2>
          <p className="text-gray-600 mt-1">נהל את הבורדים והרשאות המשתמשים</p>
        </div>
        <Button onClick={() => setShowCreator(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          בורד חדש
        </Button>
      </div>

      {/* סטטיסטיקות */}
      <BoardManagerStats
        totalBoards={totalBoards}
        regularBoardsCount={regularBoardsCount}
        dynamicBoardsCount={dynamicBoardsCount}
        customBoardsCount={customBoardsCount}
      />

      {/* בורדים רגילים עם הרשאות */}
      <RegularBoardsList
        boards={regularBoards}
        selectedBoardForPermissions={selectedBoardForPermissions}
        onTogglePermissions={handleTogglePermissions}
      />

      {/* הצגת מנהל הרשאות */}
      {selectedBoardForPermissions && (
        <Suspense fallback={<div className="animate-pulse h-32 bg-gray-100 rounded"></div>}>
          <BoardPermissionsManager 
            boardId={selectedBoardForPermissions}
          />
        </Suspense>
      )}

      {/* בורדים מקובצים לפי סוג - עם virtualization */}
      <Suspense fallback={<div className="animate-pulse h-32 bg-gray-100 rounded"></div>}>
        <VirtualizedBoardsList
          groupedBoards={groupBoardsByType}
          onDeleteBoard={deleteBoardSettings}
          getBoardTypeLabel={getBoardTypeLabel}
        />
      </Suspense>

      {/* הצגת empty state רק אם אין בורדים כלל */}
      {totalBoards === 0 && (
        <EmptyBoardsState onCreateBoard={() => setShowCreator(true)} />
      )}

      {/* BoardCreator Modal - lazy loaded */}
      {showCreator && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>}>
          <BoardCreator
            onClose={() => setShowCreator(false)}
            onBoardCreated={handleBoardCreatedAndClose}
          />
        </Suspense>
      )}
    </div>
  );
};

export default BoardManager;
