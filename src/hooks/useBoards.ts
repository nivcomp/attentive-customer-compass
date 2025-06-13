
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Board, BoardColumn, BoardItem, BoardView } from '@/types/board';
import { useToast } from '@/hooks/use-toast';

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBoards = async () => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBoards(data || []);
    } catch (error) {
      console.error('Error fetching boards:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את הלוחות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .insert([{ name, description }])
        .select()
        .single();

      if (error) throw error;
      
      setBoards(prev => [data, ...prev]);
      toast({
        title: "הצלחה",
        description: "הלוח נוצר בהצלחה",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating board:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן ליצור את הלוח",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateBoard = async (id: string, updates: Partial<Board>) => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setBoards(prev => prev.map(board => board.id === id ? data : board));
      toast({
        title: "הצלחה",
        description: "הלוח עודכן בהצלחה",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating board:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את הלוח",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBoards(prev => prev.filter(board => board.id !== id));
      toast({
        title: "הצלחה",
        description: "הלוח נמחק בהצלחה",
      });
    } catch (error) {
      console.error('Error deleting board:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן למחוק את הלוח",
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
    createBoard,
    updateBoard,
    deleteBoard,
    refetch: fetchBoards,
  };
};
