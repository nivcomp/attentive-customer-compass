
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsAPI, BoardPermission } from '@/api/boards';
import { toast } from 'sonner';

export const useBoardPermissions = (boardId: string) => {
  return useQuery({
    queryKey: ['board-permissions', boardId],
    queryFn: () => boardsAPI.getBoardPermissions(boardId),
    enabled: !!boardId,
  });
};

export const useAddBoardPermission = (boardId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, permissionType }: { 
      userId: string; 
      permissionType: 'view' | 'edit' | 'admin' 
    }) => boardsAPI.addPermission(boardId, userId, permissionType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-permissions', boardId] });
      toast.success('הרשאה נוספה בהצלחה');
    },
    onError: (error) => {
      console.error('Error adding board permission:', error);
      toast.error('שגיאה בהוספת הרשאה');
    },
  });
};

export const useUpdateBoardPermission = (boardId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, permissionType }: { 
      id: string; 
      permissionType: 'view' | 'edit' | 'admin' 
    }) => boardsAPI.updatePermission(id, permissionType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-permissions', boardId] });
      toast.success('הרשאה עודכנה בהצלחה');
    },
    onError: (error) => {
      console.error('Error updating board permission:', error);
      toast.error('שגיאה בעדכון הרשאה');
    },
  });
};

export const useRemoveBoardPermission = (boardId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => boardsAPI.removePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-permissions', boardId] });
      toast.success('הרשאה הוסרה בהצלחה');
    },
    onError: (error) => {
      console.error('Error removing board permission:', error);
      toast.error('שגיאה בהסרת הרשאה');
    },
  });
};

export const useCheckBoardPermission = (boardId: string, requiredPermission: 'view' | 'edit' | 'admin') => {
  return useQuery({
    queryKey: ['board-permission-check', boardId, requiredPermission],
    queryFn: () => boardsAPI.checkBoardPermission(boardId, requiredPermission),
    enabled: !!boardId && !!requiredPermission,
  });
};
