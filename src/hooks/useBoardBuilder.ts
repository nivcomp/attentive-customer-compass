
import { useState } from 'react';
import { useBoards } from "@/hooks/useBoards";
import { useBoardColumns } from "@/hooks/useBoardColumns";

export const useBoardBuilder = () => {
  const { boards, loading: boardsLoading, createBoard } = useBoards();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const { columns, createColumn, updateColumn, deleteColumn } = useBoardColumns(selectedBoardId);
  
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState<'text' | 'number' | 'date' | 'select' | 'status'>('text');
  const [columnRequired, setColumnRequired] = useState(false);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    
    try {
      const board = await createBoard({ 
        name: newBoardName, 
        description: newBoardDescription,
        visibility: 'private',
        board_config: {}
      });
      if (board) {
        setNewBoardName('');
        setNewBoardDescription('');
        setShowCreateBoard(false);
        setSelectedBoardId(board.id);
      }
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleCreateColumn = async () => {
    if (!columnName.trim() || !selectedBoardId) return;
    
    const column = await createColumn({
      board_id: selectedBoardId,
      name: columnName,
      column_type: columnType,
      column_order: columns.length,
      is_required: columnRequired,
    });
    
    if (column) {
      setColumnName('');
      setColumnType('text');
      setColumnRequired(false);
      setShowCreateColumn(false);
    }
  };

  return {
    // State
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
    
    // Actions
    handleCreateBoard,
    handleCreateColumn,
    updateColumn,
    deleteColumn,
  };
};
