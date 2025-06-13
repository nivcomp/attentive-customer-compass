
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsAPI, Lead } from '@/api/leads';
import { toast } from 'sonner';

export const useLeads = () => {
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: leadsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('ליד נוצר בהצלחה');
    },
    onError: (error) => {
      console.error('Error creating lead:', error);
      toast.error('שגיאה ביצירת הליד');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Lead> }) =>
      leadsAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('הליד עודכן בהצלחה');
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      toast.error('שגיאה בעדכון הליד');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: leadsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('הליד נמחק בהצלחה');
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast.error('שגיאה במחיקת הליד');
    },
  });

  const convertMutation = useMutation({
    mutationFn: ({ leadId, targetBoardId, leadData }: {
      leadId: string;
      targetBoardId: string;
      leadData: Record<string, any>;
    }) => leadsAPI.convertLead(leadId, targetBoardId, leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dynamic-board-items'] });
      toast.success('הליד הומר בהצלחה');
    },
    onError: (error) => {
      console.error('Error converting lead:', error);
      toast.error('שגיאה בהמרת הליד');
    },
  });

  return {
    leads,
    loading: isLoading,
    error,
    createLead: createMutation.mutate,
    updateLead: updateMutation.mutate,
    deleteLead: deleteMutation.mutate,
    convertLead: convertMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isConverting: convertMutation.isPending,
  };
};
