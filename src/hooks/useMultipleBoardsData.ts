
import { useState, useEffect } from 'react';
import { useDynamicBoardColumns } from './useDynamicBoardColumns';
import { useDynamicBoardItems } from './useDynamicBoardItems';

export const useMultipleBoardsData = (boardIds: string[]) => {
  const [boardsData, setBoardsData] = useState<Record<string, {
    columns: any[];
    items: any[];
    loading: boolean;
  }>>({});

  // Initialize data for each board
  useEffect(() => {
    const initialData: Record<string, any> = {};
    boardIds.forEach(boardId => {
      initialData[boardId] = {
        columns: [],
        items: [],
        loading: true
      };
    });
    setBoardsData(initialData);
  }, [boardIds]);

  // Fetch data for each board
  boardIds.forEach(boardId => {
    const { columns, loading: columnsLoading } = useDynamicBoardColumns(boardId);
    const { items, loading: itemsLoading } = useDynamicBoardItems(boardId);

    useEffect(() => {
      setBoardsData(prev => ({
        ...prev,
        [boardId]: {
          columns: columns || [],
          items: items || [],
          loading: columnsLoading || itemsLoading
        }
      }));
    }, [columns, items, columnsLoading, itemsLoading, boardId]);
  });

  return { boardsData };
};
