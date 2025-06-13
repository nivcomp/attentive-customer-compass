
import { useState, useEffect } from 'react';
import { companiesAPI, type Company } from '@/api/database';
import { useToast } from '@/hooks/use-toast';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesAPI.getAll();
      setCompanies(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת החברות';
      setError(errorMessage);
      console.error('Error fetching companies:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at'>) => {
    try {
      const newCompany = await companiesAPI.create(companyData);
      setCompanies(prev => [newCompany, ...prev]);
      toast({
        title: "הצלחה",
        description: "החברה נוספה בהצלחה",
      });
      return newCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בהוספת החברה';
      console.error('Error creating company:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    createCompany,
    refetch: fetchCompanies,
  };
};
