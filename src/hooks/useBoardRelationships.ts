
import { useState, useEffect } from 'react';
import { boardRelationshipsAPI, itemRelationshipsAPI, type BoardRelationship, type ItemRelationship } from '@/api/boardRelationships';
import { useToast } from '@/hooks/use-toast';

export const useBoardRelationships = (boardId?: string) => {
  const [relationships, setRelationships] = useState<BoardRelationship[]>([]);
  const [itemRelationships, setItemRelationships] = useState<ItemRelationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRelationships = async () => {
    if (!boardId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // טען קשרים שבהם הבורד הוא מקור או יעד
      const [sourceRelationships, targetRelationships] = await Promise.all([
        boardRelationshipsAPI.getBySourceBoard(boardId),
        boardRelationshipsAPI.getByTargetBoard(boardId)
      ]);
      
      const allRelationships = [...sourceRelationships, ...targetRelationships];
      setRelationships(allRelationships);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת הקשרים';
      setError(errorMessage);
      console.error('Error fetching relationships:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchItemRelationships = async (itemId: string) => {
    try {
      const [sourceRelations, targetRelations] = await Promise.all([
        itemRelationshipsAPI.getBySourceItem(itemId),
        itemRelationshipsAPI.getByTargetItem(itemId)
      ]);
      
      const allItemRelations = [...sourceRelations, ...targetRelations];
      setItemRelationships(allItemRelations);
      return allItemRelations;
    } catch (err) {
      console.error('Error fetching item relationships:', err);
      return [];
    }
  };

  const createItemRelationship = async (
    relationshipId: string, 
    sourceItemId: string, 
    targetItemId: string
  ) => {
    try {
      const newItemRelationship = await itemRelationshipsAPI.create({
        relationship_id: relationshipId,
        source_item_id: sourceItemId,
        target_item_id: targetItemId
      });
      
      setItemRelationships(prev => [...prev, newItemRelationship]);
      toast({
        title: "הצלחה",
        description: "הקשר נוצר בהצלחה",
      });
      return newItemRelationship;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה ביצירת הקשר';
      console.error('Error creating item relationship:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteItemRelationship = async (sourceItemId: string, targetItemId: string) => {
    try {
      await itemRelationshipsAPI.deleteByItems(sourceItemId, targetItemId);
      setItemRelationships(prev => 
        prev.filter(rel => 
          !(rel.source_item_id === sourceItemId && rel.target_item_id === targetItemId)
        )
      );
      toast({
        title: "הצלחה",
        description: "הקשר נמחק בהצלחה",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה במחיקת הקשר';
      console.error('Error deleting item relationship:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRelationships();
  }, [boardId]);

  return {
    relationships,
    itemRelationships,
    loading,
    error,
    fetchRelationships,
    fetchItemRelationships,
    createItemRelationship,
    deleteItemRelationship,
    refetch: fetchRelationships,
  };
};
