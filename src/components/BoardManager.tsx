
import React, { Suspense, lazy } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStagedBoardData } from "@/hooks/useStagedBoardData";
import SmartLoadingIndicator from "./SmartLoadingIndicator";
import ProgressiveBoardSection from "./ProgressiveBoardSection";
import EmptyBoardsState from "./EmptyBoardsState";

// Lazy load components that might not be immediately needed
const BoardCreator = lazy(() => import("./BoardCreator"));
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
    isLoading,
    loadingStage,
    isStatsReady,
    isRegularBoardsReady,
    isDynamicBoardsReady,
    isCustomBoardsReady,
    handleBoardCreated,
    deleteBoardSettings,
    getBoardTypeLabel,
  } = useStagedBoardData();

  const handleBoardCreatedAndClose = React.useCallback((boardId: string) => {
    handleBoardCreated(boardId);
    setShowCreator(false);
  }, [handleBoardCreated]);

  const boardStats = {
    totalBoards,
    regularBoardsCount,
    dynamicBoardsCount,
    customBoardsCount,
  };

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

      {/* Smart Loading Indicator - Shows progress */}
      {isLoading && <SmartLoadingIndicator loadingStage={loadingStage} />}

      {/* Progressive Content Loading */}
      <ProgressiveBoardSection
        isStatsReady={isStatsReady}
        isRegularBoardsReady={isRegularBoardsReady}
        isDynamicBoardsReady={isDynamicBoardsReady}
        isCustomBoardsReady={isCustomBoardsReady}
        boardStats={boardStats}
        regularBoards={regularBoards}
        dynamicBoards={dynamicBoards}
        groupBoardsByType={groupBoardsByType}
        deleteBoardSettings={deleteBoardSettings}
        getBoardTypeLabel={getBoardTypeLabel}
      />

      {/* Custom Boards with Virtualization - Only after custom boards are ready */}
      {isCustomBoardsReady && Object.keys(groupBoardsByType).length > 0 && (
        <Suspense fallback={<div className="animate-pulse h-32 bg-gray-100 rounded"></div>}>
          <VirtualizedBoardsList
            groupedBoards={groupBoardsByType}
            onDeleteBoard={deleteBoardSettings}
            getBoardTypeLabel={getBoardTypeLabel}
          />
        </Suspense>
      )}

      {/* Empty State - Only show after everything is loaded */}
      {!isLoading && totalBoards === 0 && (
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
