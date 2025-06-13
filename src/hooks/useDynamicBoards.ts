
import { useState, useEffect } from 'react';
import { dynamicBoardsAPI, type DynamicBoard } from '@/api/dynamicBoard';
import { useToast } from '@/hooks/use-toast';

export const useDynamicBoards = () => {
  const [boards, setBoards] = useState<DynamicBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dynamicBoardsAPI.getAll();
      setBoards(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת הבורדים';
      setError(errorMessage);
      console.error('Error fetching boards:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (boardData: Omit<DynamicBoard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newBoard = await dynamicBoardsAPI.create(boardData);
      setBoards(prev => [newBoard, ...prev]);
      toast({
        title: "הצלחה",
        description: "הבורד נוצר בהצלחה",
      });
      return newBoard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה ביצירת הבורד';
      console.error('Error creating board:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateBoard = async (id: string, updates: Partial<Omit<DynamicBoard, 'id' | 'created_at'>>) => {
    try {
      const updatedBoard = await dynamicBoardsAPI.update(id, updates);
      setBoards(prev => prev.map(board => board.id === id ? updatedBoard : board));
      toast({
        title: "הצלחה",
        description: "הבורד עודכן בהצלחה",
      });
      return updatedBoard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בעדכון הבורד';
      console.error('Error updating board:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      await dynamicBoardsAPI.delete(id);
      setBoards(prev => prev.filter(board => board.id !== id));
      toast({
        title: "הצלחה",
        description: "הבורד נמחק בהצלחה",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה במחיקת הבורד';
      console.error('Error deleting board:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return {
    boards,
    loading,
    error,
    createBoard,
    updateBoard,
    deleteBoard,
    refetch: fetchBoards,
  };
};
