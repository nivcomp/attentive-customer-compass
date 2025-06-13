
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BoardType, SystemTemplate } from '@/api/boardTypes';

export const useBoardTypes = () => {
  const [systemTemplates, setSystemTemplates] = useState<SystemTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSystemTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('board_templates')
        .select('*')
        .eq('is_public', true)
        .order('category');
      
      if (error) throw error;
      
      // Transform the data to match SystemTemplate interface with proper array handling
      const transformedData: SystemTemplate[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        template_data: Array.isArray(item.template_data) ? item.template_data : [],
        is_public: item.is_public,
        created_at: item.created_at
      }));
      setSystemTemplates(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת תבניות המערכת';
      setError(errorMessage);
      console.error('Error fetching system templates:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTemplatesByType = (boardType: BoardType) => {
    return systemTemplates.filter(template => template.category === boardType);
  };

  const createBoardFromTemplate = async (
    templateId: string, 
    boardName: string, 
    boardDescription?: string
  ) => {
    try {
      const template = systemTemplates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('תבנית לא נמצאה');
      }

      // יצירת הבורד
      const { data: boardData, error: boardError } = await supabase
        .from('dynamic_boards')
        .insert([{
          name: boardName,
          description: boardDescription,
          board_type: template.category
        }])
        .select()
        .single();

      if (boardError) throw boardError;

      // יצירת העמודות מהתבנית
      if (Array.isArray(template.template_data) && template.template_data.length > 0) {
        const columns = template.template_data.map((col: any) => ({
          board_id: boardData.id,
          name: col.name,
          column_type: col.type,
          column_order: col.order || 0,
          is_required: col.required || false,
          options: col.options ? { options: col.options } : null
        }));

        const { error: columnsError } = await supabase
          .from('dynamic_board_columns')
          .insert(columns);

        if (columnsError) {
          console.error('Error creating columns:', columnsError);
          // לא נזרוק שגיאה כאן כי הבורד כבר נוצר
        }
      }

      toast({
        title: "הצלחה",
        description: "הבורד נוצר בהצלחה מהתבנית",
      });

      return boardData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה ביצירת בורד מתבנית';
      console.error('Error creating board from template:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchSystemTemplates();
  }, []);

  return {
    systemTemplates,
    loading,
    error,
    getTemplatesByType,
    createBoardFromTemplate,
    refetch: fetchSystemTemplates,
  };
};
