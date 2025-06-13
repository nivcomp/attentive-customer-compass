
import { useState, useEffect } from 'react';
import { dynamicBoardItemsAPI, type DynamicBoardItem } from '@/api/dynamicBoard';
import { useToast } from '@/hooks/use-toast';

export const useDynamicBoardItems = (boardId: string | null) => {
  const [items, setItems] = useState<DynamicBoardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    if (!boardId) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await dynamicBoardItemsAPI.getByBoardId(boardId);
      setItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת הפריטים';
      setError(errorMessage);
      console.error('Error fetching items:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Omit<DynamicBoardItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newItem = await dynamicBoardItemsAPI.create(itemData);
      setItems(prev => [...prev, newItem].sort((a, b) => a.item_order - b.item_order));
      toast({
        title: "הצלחה",
        description: "הפריט נוסף בהצלחה",
      });
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בהוספת הפריט';
      console.error('Error creating item:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateItem = async (id: string, updates: Partial<Omit<DynamicBoardItem, 'id' | 'created_at'>>) => {
    try {
      const updatedItem = await dynamicBoardItemsAPI.update(id, updates);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      toast({
        title: "הצלחה",
        description: "הפריט עודכן בהצלחה",
      });
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בעדכון הפריט';
      console.error('Error updating item:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await dynamicBoardItemsAPI.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "הצלחה",
        description: "הפריט נמחק בהצלחה",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה במחיקת הפריט';
      console.error('Error deleting item:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, [boardId]);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
};
