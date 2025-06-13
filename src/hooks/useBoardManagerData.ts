
import { useOptimizedBoardData } from './useOptimizedBoardData';
import { useOptimizedPermissions } from './useOptimizedPermissions';

/**
 * @deprecated Use useOptimizedBoardData and useOptimizedPermissions instead
 * This hook is kept for backward compatibility but will be removed in the future
 */
export const useBoardManagerData = () => {
  console.warn('useBoardManagerData is deprecated. Use useOptimizedBoardData and useOptimizedPermissions instead.');
  
  const boardData = useOptimizedBoardData();
  const permissionsData = useOptimizedPermissions();
  
  return {
    ...boardData,
    ...permissionsData,
    // Legacy properties for backward compatibility
    showCreator: false,
    setShowCreator: () => console.warn('setShowCreator is deprecated'),
  };
};
