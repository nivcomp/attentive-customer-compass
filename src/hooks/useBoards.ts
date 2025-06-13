
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsAPI, Board } from '@/api/boards';
import { toast } from 'sonner';

export const useBoards = () => {
  const queryClient = useQueryClient();
  
  const boardsQuery = useQuery({
    queryKey: ['boards'],
    queryFn: boardsAPI.getAll,
  });

  const createBoardMutation = useMutation({
    mutationFn: (board: Omit<Board, 'id' | 'created_at' | 'updated_at' | 'owner_id'>) =>
      boardsAPI.create(board),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('בורד נוצר בהצלחה');
    },
    onError: (error) => {
      console.error('Error creating board:', error);
      toast.error('שגיאה ביצירת הבורד');
    },
  });

  return {
    boards: boardsQuery.data || [],
    loading: boardsQuery.isLoading,
    createBoard: createBoardMutation.mutateAsync,
    isCreating: createBoardMutation.isPending,
    error: boardsQuery.error
  };
};

export const useBoard = (id: string) => {
  return useQuery({
    queryKey: ['board', id],
    queryFn: () => boardsAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (board: Omit<Board, 'id' | 'created_at' | 'updated_at' | 'owner_id'>) =>
      boardsAPI.create(board),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('בורד נוצר בהצלחה');
    },
    onError: (error) => {
      console.error('Error creating board:', error);
      toast.error('שגיאה ביצירת הבורד');
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Board> }) =>
      boardsAPI.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['board', data.id] });
      toast.success('בורד עודכן בהצלחה');
    },
    onError: (error) => {
      console.error('Error updating board:', error);
      toast.error('שגיאה בעדכון הבורד');
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => boardsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('בורד נמחק בהצלחה');
    },
    onError: (error) => {
      console.error('Error deleting board:', error);
      toast.error('שגיאה במחיקת הבורד');
    },
  });
};
