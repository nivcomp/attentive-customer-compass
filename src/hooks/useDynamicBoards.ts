
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BoardType } from '@/api/boardTypes';

export interface DynamicBoard {
  id: string;
  name: string;
  description?: string;
  board_type?: string;
  created_at?: string;
  updated_at?: string;
}

export const useDynamicBoards = () => {
  const [boards, setBoards] = useState<DynamicBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('dynamic_boards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBoards(data || []);
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

  const createBoard = async (boardData: {
    name: string;
    description?: string;
    board_type?: BoardType;
  }) => {
    try {
      const { data, error } = await supabase
        .from('dynamic_boards')
        .insert([{
          name: boardData.name,
          description: boardData.description,
          board_type: boardData.board_type || 'custom'
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setBoards(prev => [data, ...prev]);
      toast({
        title: "הצלחה",
        description: "הבורד נוצר בהצלחה",
      });
      return data;
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
      const { data, error } = await supabase
        .from('dynamic_boards')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setBoards(prev => prev.map(board => board.id === id ? data : board));
      toast({
        title: "הצלחה",
        description: "הבורד עודכן בהצלחה",
      });
      return data;
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
      const { error } = await supabase
        .from('dynamic_boards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
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
