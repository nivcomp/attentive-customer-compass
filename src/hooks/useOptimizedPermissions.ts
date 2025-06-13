
import { useState, useCallback } from 'react';

export const useOptimizedPermissions = () => {
  const [selectedBoardForPermissions, setSelectedBoardForPermissions] = useState<string | null>(null);

  const handleTogglePermissions = useCallback((boardId: string) => {
    setSelectedBoardForPermissions(prev => 
      prev === boardId ? null : boardId
    );
  }, []);

  return {
    selectedBoardForPermissions,
    handleTogglePermissions,
  };
};
