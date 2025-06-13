
import { useState, useEffect, useMemo, useCallback } from 'react';
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

interface LoadingStage {
  stage: 'stats' | 'regular' | 'dynamic' | 'custom' | 'complete';
  progress: number;
  message: string;
}

// Optimized localStorage operations with caching
const boardsCache = new Map<string, CustomBoard[]>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let lastCacheTime = 0;

const loadCustomBoardsOptimized = (): CustomBoard[] => {
  const now = Date.now();
  
  if (boardsCache.has('customBoards') && (now - lastCacheTime) < CACHE_DURATION) {
    return boardsCache.get('customBoards') || [];
  }
  
  try {
    const savedBoards = localStorage.getItem('customBoards');
    const boards = savedBoards ? JSON.parse(savedBoards) : [];
    
    boardsCache.set('customBoards', boards);
    lastCacheTime = now;
    
    return boards;
  } catch (error) {
    console.error('Error loading custom boards:', error);
    return [];
  }
};

export const useStagedBoardData = () => {
  const [loadingStage, setLoadingStage] = useState<LoadingStage>({
    stage: 'stats',
    progress: 0,
    message: 'מתחיל לטעון נתונים...'
  });

  // Stage 1: Load regular boards first (usually fastest)
  const { boards: regularBoards, loading: regularLoading } = useBoards();
  
  // Stage 2: Load dynamic boards
  const { boards: dynamicBoards, loading: dynamicLoading } = useDynamicBoards();
  
  // Stage 3: Load organizations
  const { data: organizations } = useOrganizations();

  // Stage 4: Load custom boards
  const customBoardsQuery = useQuery({
    queryKey: ['customBoards'],
    queryFn: loadCustomBoardsOptimized,
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2,
  });

  // Update loading stages based on what's loaded
  useEffect(() => {
    if (!regularLoading && regularBoards.length >= 0) {
      setLoadingStage({
        stage: 'regular',
        progress: 25,
        message: 'טוען בורדים דינמיים...'
      });
    }
    
    if (!regularLoading && !dynamicLoading && dynamicBoards.length >= 0) {
      setLoadingStage({
        stage: 'dynamic',
        progress: 50,
        message: 'טוען בורדים מותאמים...'
      });
    }
    
    if (!regularLoading && !dynamicLoading && !customBoardsQuery.isLoading) {
      setLoadingStage({
        stage: 'custom',
        progress: 75,
        message: 'מסיים טעינה...'
      });
      
      setTimeout(() => {
        setLoadingStage({
          stage: 'complete',
          progress: 100,
          message: 'הטעינה הושלמה!'
        });
      }, 300);
    }
  }, [regularLoading, dynamicLoading, customBoardsQuery.isLoading, regularBoards.length, dynamicBoards.length]);

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
    customBoardsQuery.refetch();
  }, [customBoardsQuery.refetch]);

  const deleteBoardSettings = useCallback((boardId: string) => {
    const currentBoards = customBoardsQuery.data || [];
    const updatedBoards = currentBoards.filter(board => board.id !== boardId);
    
    try {
      localStorage.setItem('customBoards', JSON.stringify(updatedBoards));
      boardsCache.set('customBoards', updatedBoards);
      lastCacheTime = Date.now();
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

  const isLoading = loadingStage.stage !== 'complete';
  const isStatsReady = !regularLoading;
  const isRegularBoardsReady = !regularLoading;
  const isDynamicBoardsReady = !dynamicLoading;
  const isCustomBoardsReady = !customBoardsQuery.isLoading;

  return {
    // Data
    customBoards: customBoardsQuery.data || [],
    dynamicBoards,
    regularBoards,
    organizations,
    
    // Computed
    ...boardStats,
    groupBoardsByType,
    
    // Loading states
    isLoading,
    loadingStage,
    isStatsReady,
    isRegularBoardsReady,
    isDynamicBoardsReady,
    isCustomBoardsReady,
    
    // Actions
    handleBoardCreated,
    deleteBoardSettings,
    getBoardTypeLabel,
  };
};
