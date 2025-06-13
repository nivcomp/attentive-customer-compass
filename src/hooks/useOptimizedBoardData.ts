
import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useBoards } from "@/hooks/useBoards";
import { useOrganizations } from "@/hooks/useOrganizations";

interface CustomBoard {
  id: string;
  name: string;
  description?: string;
  type: string;
  fields: any[];
  createdAt: string;
}

// Optimized localStorage operations with caching
const boardsCache = new Map<string, CustomBoard[]>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let lastCacheTime = 0;

const loadCustomBoardsOptimized = (): CustomBoard[] => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (boardsCache.has('customBoards') && (now - lastCacheTime) < CACHE_DURATION) {
    return boardsCache.get('customBoards') || [];
  }
  
  try {
    const savedBoards = localStorage.getItem('customBoards');
    const boards = savedBoards ? JSON.parse(savedBoards) : [];
    
    // Update cache
    boardsCache.set('customBoards', boards);
    lastCacheTime = now;
    
    return boards;
  } catch (error) {
    console.error('Error loading custom boards:', error);
    return [];
  }
};

export const useOptimizedBoardData = () => {
  // Use React Query for API data with optimized stale times
  const { boards: dynamicBoards, loading: dynamicLoading } = useDynamicBoards();
  const { boards: regularBoards, loading: regularLoading } = useBoards();
  const { data: organizations } = useOrganizations();

  // Use React Query for custom boards with localStorage
  const customBoardsQuery = useQuery({
    queryKey: ['customBoards'],
    queryFn: loadCustomBoardsOptimized,
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2,
  });

  // Memoized calculations
  const boardStats = useMemo(() => {
    const customBoards = customBoardsQuery.data || [];
    const totalBoards = dynamicBoards.length + regularBoards.length + customBoards.length;
    
    return {
      totalBoards,
      regularBoardsCount: regularBoards.length,
      dynamicBoardsCount: dynamicBoards.length,
      customBoardsCount: customBoards.length,
    };
  }, [
    dynamicBoards.length,
    regularBoards.length,
    customBoardsQuery.data?.length
  ]);

  const groupBoardsByType = useMemo(() => {
    const customBoards = customBoardsQuery.data || [];
    const grouped: Record<string, CustomBoard[]> = {};
    
    for (const board of customBoards) {
      if (!grouped[board.type]) {
        grouped[board.type] = [];
      }
      grouped[board.type].push(board);
    }
    
    return grouped;
  }, [customBoardsQuery.data]);

  // Optimized handlers
  const handleBoardCreated = useCallback((boardId: string) => {
    // Invalidate and refetch custom boards
    customBoardsQuery.refetch();
  }, [customBoardsQuery.refetch]);

  const deleteBoardSettings = useCallback((boardId: string) => {
    const currentBoards = customBoardsQuery.data || [];
    const updatedBoards = currentBoards.filter(board => board.id !== boardId);
    
    try {
      localStorage.setItem('customBoards', JSON.stringify(updatedBoards));
      // Update cache immediately
      boardsCache.set('customBoards', updatedBoards);
      lastCacheTime = Date.now();
      // Trigger refetch
      customBoardsQuery.refetch();
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  }, [customBoardsQuery.data, customBoardsQuery.refetch]);

  const getBoardTypeLabel = useCallback((type: string) => {
    const types: Record<string, string> = {
      companies: 'חברות',
      contacts: 'אנשי קשר',
      deals: 'עסקאות',
      leads: 'לידים'
    };
    return types[type] || type;
  }, []);

  const loading = dynamicLoading || regularLoading || customBoardsQuery.isLoading;

  return {
    // Data
    customBoards: customBoardsQuery.data || [],
    dynamicBoards,
    regularBoards,
    organizations,
    
    // Computed
    ...boardStats,
    groupBoardsByType,
    loading,
    
    // Actions
    handleBoardCreated,
    deleteBoardSettings,
    getBoardTypeLabel,
  };
};
