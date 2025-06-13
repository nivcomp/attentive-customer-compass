
import React from 'react';
import { useBoardBuilder } from "@/hooks/useBoardBuilder";
import BoardCreationDialog from "./BoardCreationDialog";
import BoardsList from "./BoardsList";
import ColumnsManager from "./ColumnsManager";

const BoardBuilder = () => {
  const {
    boards,
    boardsLoading,
    selectedBoardId,
    setSelectedBoardId,
    columns,
    newBoardName,
    setNewBoardName,
    newBoardDescription,
    setNewBoardDescription,
    showCreateBoard,
    setShowCreateBoard,
    showCreateColumn,
    setShowCreateColumn,
    columnName,
    setColumnName,
    columnType,
    setColumnType,
    columnRequired,
    setColumnRequired,
    handleCreateBoard,
    handleCreateColumn,
    updateColumn,
    deleteColumn,
  } = useBoardBuilder();

  if (boardsLoading) {
    return <div className="flex justify-center p-8">טוען...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">בונה לוחות מותאמים אישית</h2>
        <BoardCreationDialog
          isOpen={showCreateBoard}
          onOpenChange={setShowCreateBoard}
          boardName={newBoardName}
          setBoardName={setNewBoardName}
          boardDescription={newBoardDescription}
          setBoardDescription={setNewBoardDescription}
          onCreateBoard={handleCreateBoard}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BoardsList
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
        />

        <ColumnsManager
          selectedBoardId={selectedBoardId}
          columns={columns}
          showCreateColumn={showCreateColumn}
          setShowCreateColumn={setShowCreateColumn}
          columnName={columnName}
          setColumnName={setColumnName}
          columnType={columnType}
          setColumnType={setColumnType}
          columnRequired={columnRequired}
          setColumnRequired={setColumnRequired}
          onCreateColumn={handleCreateColumn}
          onUpdateColumn={updateColumn}
          onDeleteColumn={deleteColumn}
        />
      </div>
    </div>
  );
};

export default BoardBuilder;
