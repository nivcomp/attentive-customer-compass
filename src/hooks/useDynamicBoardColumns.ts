
import { useState, useEffect } from 'react';
import { dynamicBoardColumnsAPI, type DynamicBoardColumn } from '@/api/dynamicBoard';
import { useToast } from '@/hooks/use-toast';

export const useDynamicBoardColumns = (boardId: string | null) => {
  const [columns, setColumns] = useState<DynamicBoardColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchColumns = async () => {
    if (!boardId) {
      setColumns([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await dynamicBoardColumnsAPI.getByBoardId(boardId);
      setColumns(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת העמודות';
      setError(errorMessage);
      console.error('Error fetching columns:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createColumn = async (columnData: Omit<DynamicBoardColumn, 'id' | 'created_at'>) => {
    try {
      const newColumn = await dynamicBoardColumnsAPI.create(columnData);
      setColumns(prev => [...prev, newColumn].sort((a, b) => a.column_order - b.column_order));
      toast({
        title: "הצלחה",
        description: "העמודה נוספה בהצלחה",
      });
      return newColumn;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בהוספת העמודה';
      console.error('Error creating column:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateColumn = async (id: string, updates: Partial<Omit<DynamicBoardColumn, 'id' | 'created_at'>>) => {
    try {
      const updatedColumn = await dynamicBoardColumnsAPI.update(id, updates);
      setColumns(prev => prev.map(col => col.id === id ? updatedColumn : col));
      toast({
        title: "הצלחה",
        description: "העמודה עודכנה בהצלחה",
      });
      return updatedColumn;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בעדכון העמודה';
      console.error('Error updating column:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      await dynamicBoardColumnsAPI.delete(id);
      setColumns(prev => prev.filter(col => col.id !== id));
      toast({
        title: "הצלחה",
        description: "העמודה נמחקה בהצלחה",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה במחיקת העמודה';
      console.error('Error deleting column:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
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
    error,
    createColumn,
    updateColumn,
    deleteColumn,
    refetch: fetchColumns,
  };
};
