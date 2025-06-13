
import { useState, useEffect } from 'react';
import { useDynamicBoardColumns } from './useDynamicBoardColumns';
import { useDynamicBoardItems } from './useDynamicBoardItems';
import { DynamicBoardColumn, DynamicBoardItem } from '@/api/dynamicBoard';

interface BoardData {
  columns: DynamicBoardColumn[];
  items: D

icBoardItem[];
  loading: boolean;
}

export const useMultipleBoardsData = (boardIds: string[]) => {
  const [boardsData, setBoardsData] = useState<Record<string, BoardData>>({});

  useEffect(() => {
    // איפוס נתונים כשמשתנים ה-boardIds
    setBoardsData({});
    
    // טעינת נתונים לכל בורד
    boardIds.forEach(boardId => {
      setBoardsData(prev => ({
        ...prev,
        [boardId]: {
          columns: [],
          items: [],
          loading: true
        }
      }));
    });
  }, [boardIds]);

  return boardsData;
};
