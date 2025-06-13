
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BoardColumn } from '@/types/board';
import { useToast } from '@/hooks/use-toast';

export const useBoardColumns = (boardId: string | null) => {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchColumns = async () => {
    if (!boardId) {
      setColumns([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('board_columns')
        .select('*')
        .eq('board_id', boardId)
        .order('column_order', { ascending: true });

      if (error) throw error;
      
      // Type assertion to ensure compatibility with our BoardColumn interface
      const typedData = data?.map(col => ({
        ...col,
        column_type: col.column_type as 'text' | 'number' | 'date' | 'select' | 'status'
      })) || [];
      
      setColumns(typedData);
    } catch (error) {
      console.error('Error fetching columns:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את העמודות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createColumn = async (column: Omit<BoardColumn, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('board_columns')
        .insert([column])
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      const typedData = {
        ...data,
        column_type: data.column_type as 'text' | 'number' | 'date' | 'select' | 'status'
      };
      
      setColumns(prev => [...prev, typedData].sort((a, b) => a.column_order - b.column_order));
      toast({
        title: "הצלחה",
        description: "העמודה נוצרה בהצלחה",
      });
      
      return typedData;
    } catch (error) {
      console.error('Error creating column:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן ליצור את העמודה",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateColumn = async (id: string, updates: Partial<BoardColumn>) => {
    try {
      const { data, error } = await supabase
        .from('board_columns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      const typedData = {
        ...data,
        column_type: data.column_type as 'text' | 'number' | 'date' | 'select' | 'status'
      };
      
      setColumns(prev => prev.map(col => col.id === id ? typedData : col));
      toast({
        title: "הצלחה",
        description: "העמודה עודכנה בהצלחה",
      });
      
      return typedData;
    } catch (error) {
      console.error('Error updating column:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את העמודה",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      const { error } = await supabase
        .from('board_columns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setColumns(prev => prev.filter(col => col.id !== id));
      toast({
        title: "הצלחה",
        description: "העמודה נמחקה בהצלחה",
      });
    } catch (error) {
      console.error('Error deleting column:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן למחוק את העמודה",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchColumns();
  }, [boardId]);

  return {
    columns,
    loading,
    createColumn,
    updateColumn,
    deleteColumn,
    refetch: fetchColumns,
  };
};
