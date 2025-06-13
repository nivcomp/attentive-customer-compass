
import { useState, useEffect } from 'react';
import { boardTemplatesAPI, type BoardTemplate } from '@/api/boardTemplates';
import { useToast } from '@/hooks/use-toast';

export const useBoardTemplates = () => {
  const [templates, setTemplates] = useState<BoardTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boardTemplatesAPI.getAll();
      setTemplates(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת התבניות';
      setError(errorMessage);
      console.error('Error fetching templates:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: Omit<BoardTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    try {
      const newTemplate = await boardTemplatesAPI.create(templateData);
      setTemplates(prev => [newTemplate, ...prev]);
      toast({
        title: "הצלחה",
        description: "התבנית נוצרה בהצלחה",
      });
      return newTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה ביצירת התבנית';
      console.error('Error creating template:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await boardTemplatesAPI.delete(id);
      setTemplates(prev => prev.filter(template => template.id !== id));
      toast({
        title: "הצלחה",
        description: "התבנית נמחקה בהצלחה",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה במחיקת התבנית';
      console.error('Error deleting template:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const useTemplate = async (templateId: string) => {
    try {
      await boardTemplatesAPI.incrementUsage(templateId);
      // Update local state
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, usage_count: t.usage_count + 1 } : t
      ));
    } catch (err) {
      console.error('Error updating template usage:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    createTemplate,
    deleteTemplate,
    useTemplate,
    refetch: fetchTemplates,
  };
};
