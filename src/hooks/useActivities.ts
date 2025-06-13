
import { useState, useEffect } from 'react';
import { activitiesAPI, type Activity } from '@/api/database';
import { useToast } from '@/hooks/use-toast';

export const useActivities = (customerId?: number) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = customerId 
        ? await activitiesAPI.getByCustomerId(customerId)
        : await activitiesAPI.getAll();
      setActivities(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת הפעילויות';
      setError(errorMessage);
      console.error('Error fetching activities:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: Omit<Activity, 'id' | 'created_at'>) => {
    try {
      const newActivity = await activitiesAPI.create(activityData);
      setActivities(prev => [newActivity, ...prev]);
      toast({
        title: "הצלחה",
        description: "הפעילות נוספה בהצלחה",
      });
      return newActivity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בהוספת הפעילות';
      console.error('Error creating activity:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [customerId]);

  return {
    activities,
    loading,
    error,
    createActivity,
    refetch: fetchActivities,
  };
};
