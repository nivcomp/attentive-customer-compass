
import { useState, useEffect, useMemo, useCallback } from 'react';
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

export const useBoardManagerData = () => {
  const [customBoards, setCustomBoards] = useState<CustomBoard[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedBoardForPermissions, setSelectedBoardForPermissions] = useState<string | null>(null);
  
  const { boards: dynamicBoards, loading: dynamicLoading } = useDynamicBoards();
  const { boards: regularBoards, loading: regularLoading } = useBoards();
  const { data: organizations } = useOrganizations();

  // טעינת בורדים מותאמים מ-localStorage
  useEffect(() => {
    const loadCustomBoards = () => {
      const savedBoards = localStorage.getItem('customBoards');
      if (savedBoards) {
        try {
          setCustomBoards(JSON.parse(savedBoards));
        } catch (error) {
          console.error('Error loading custom boards:', error);
          setCustomBoards([]);
        }
      }
    };

    loadCustomBoards();
  }, []);

  const handleBoardCreated = useCallback((boardId: string) => {
    const savedBoards = localStorage.getItem('customBoards');
    if (savedBoards) {
      try {
        setCustomBoards(JSON.parse(savedBoards));
      } catch (error) {
        console.error('Error loading custom boards:', error);
      }
    }
  }, []);

  const deleteBoardSettings = useCallback((boardId: string) => {
    setCustomBoards(prev => {
      const updatedBoards = prev.filter(board => board.id !== boardId);
      localStorage.setItem('customBoards', JSON.stringify(updatedBoards));
      return updatedBoards;
    });
  }, []);

  const getBoardTypeLabel = useCallback((type: string) => {
    const types: Record<string, string> = {
      companies: 'חברות',
      contacts: 'אנשי קשר',
      deals: 'עסקאות',
      leads: 'לידים'
    };
    return types[type] || type;
  }, []);

  const groupBoardsByType = useMemo(() => {
    const grouped: Record<string, CustomBoard[]> = {};
    customBoards.forEach(board => {
      if (!grouped[board.type]) {
        grouped[board.type] = [];
      }
      grouped[board.type].push(board);
    });
    return grouped;
  }, [customBoards]);

  const handleTogglePermissions = useCallback((boardId: string) => {
    setSelectedBoardForPermissions(prev => 
      prev === boardId ? null : boardId
    );
  }, []);

  const totalBoards = useMemo(() => 
    dynamicBoards.length + regularBoards.length + customBoards.length,
    [dynamicBoards.length, regularBoards.length, customBoards.length]
  );

  const loading = dynamicLoading || regularLoading;

  return {
    // State
    customBoards,
    showCreator,
    setShowCreator,
    selectedBoardForPermissions,
    
    // Data
    dynamicBoards,
    regularBoards,
    organizations,
    
    // Computed
    groupBoardsByType,
    totalBoards,
    loading,
    
    // Actions
    handleBoardCreated,
    deleteBoardSettings,
    getBoardTypeLabel,
    handleTogglePermissions,
  };
};
