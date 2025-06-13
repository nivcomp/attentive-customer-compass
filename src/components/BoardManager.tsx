
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useBoardManagerData } from "@/hooks/useBoardManagerData";
import BoardCreator from "./BoardCreator";
import BoardPermissionsManager from "./BoardPermissionsManager";
import BoardManagerStats from "./BoardManagerStats";
import RegularBoardsList from "./RegularBoardsList";
import CustomBoardsList from "./CustomBoardsList";
import EmptyBoardsState from "./EmptyBoardsState";

const BoardManager = () => {
  const {
    customBoards,
    showCreator,
    setShowCreator,
    selectedBoardForPermissions,
    dynamicBoards,
    regularBoards,
    organizations,
    groupBoardsByType,
    totalBoards,
    loading,
    handleBoardCreated,
    deleteBoardSettings,
    getBoardTypeLabel,
    handleTogglePermissions,
  } = useBoardManagerData();

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
        regularBoardsCount={regularBoards.length}
        dynamicBoardsCount={dynamicBoards.length}
        customBoardsCount={customBoards.length}
      />

      {/* בורדים רגילים עם הרשאות */}
      <RegularBoardsList
        boards={regularBoards}
        selectedBoardForPermissions={selectedBoardForPermissions}
        onTogglePermissions={handleTogglePermissions}
      />

      {/* הצגת מנהל הרשאות */}
      {selectedBoardForPermissions && (
        <BoardPermissionsManager 
          boardId={selectedBoardForPermissions}
        />
      )}

      {/* בורדים מקובצים לפי סוג */}
      <CustomBoardsList
        groupedBoards={groupBoardsByType}
        onDeleteBoard={deleteBoardSettings}
        getBoardTypeLabel={getBoardTypeLabel}
      />

      {/* הצגת empty state רק אם אין בורדים כלל */}
      {totalBoards === 0 && (
        <EmptyBoardsState onCreateBoard={() => setShowCreator(true)} />
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
