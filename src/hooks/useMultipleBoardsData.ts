
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

  // Fetch data for the first board (for now, we'll handle one at a time)
  // This is a temporary solution - a proper implementation would need a different approach
  const firstBoardId = boardIds[0] || null;
  const { columns: firstColumns, loading: firstColumnsLoading } = useDynamicBoardColumns(firstBoardId);
  const { items: firstItems, loading: firstItemsLoading } = useDynamicBoardItems(firstBoardId);

  useEffect(() => {
    if (firstBoardId) {
      setBoardsData(prev => ({
        ...prev,
        [firstBoardId]: {
          columns: firstColumns || [],
          items: firstItems || [],
          loading: firstColumnsLoading || firstItemsLoading
        }
      }));
    }
  }, [firstColumns, firstItems, firstColumnsLoading, firstItemsLoading, firstBoardId]);

  return { boardsData };
};
