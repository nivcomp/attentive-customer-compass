
import { useState, useEffect } from 'react';
import { dealsAPI, type Deal } from '@/api/database';
import { useToast } from '@/hooks/use-toast';

export const useDeals = (customerId?: number) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = customerId 
        ? await dealsAPI.getByCustomerId(customerId)
        : await dealsAPI.getAll();
      setDeals(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת העסקאות';
      setError(errorMessage);
      console.error('Error fetching deals:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDeal = async (dealData: Omit<Deal, 'id' | 'created_at'>) => {
    try {
      const newDeal = await dealsAPI.create(dealData);
      setDeals(prev => [newDeal, ...prev]);
      toast({
        title: "הצלחה",
        description: "העסקה נוספה בהצלחה",
      });
      return newDeal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בהוספת העסקה';
      console.error('Error creating deal:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateDealStatus = async (id: number, status: string) => {
    try {
      const updatedDeal = await dealsAPI.updateStatus(id, status);
      setDeals(prev => prev.map(deal => 
        deal.id === id ? updatedDeal : deal
      ));
      toast({
        title: "הצלחה",
        description: "סטטוס העסקה עודכן בהצלחה",
      });
      return updatedDeal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בעדכון סטטוס העסקה';
      console.error('Error updating deal status:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [customerId]);

  return {
    deals,
    loading,
    error,
    createDeal,
    updateDealStatus,
    refetch: fetchDeals,
  };
};
