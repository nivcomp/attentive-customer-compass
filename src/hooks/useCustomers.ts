
import { useState, useEffect } from 'react';
import { customersAPI, type Customer } from '@/api/database';
import { useToast } from '@/hooks/use-toast';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customersAPI.getAll();
      setCustomers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת הלקוחות';
      setError(errorMessage);
      console.error('Error fetching customers:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: Omit<Customer, 'id' | 'created_at'>) => {
    try {
      const newCustomer = await customersAPI.create(customerData);
      setCustomers(prev => [newCustomer, ...prev]);
      toast({
        title: "הצלחה",
        description: "הלקוח נוסף בהצלחה",
      });
      return newCustomer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בהוספת הלקוח';
      console.error('Error creating customer:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCustomer = async (id: number, updates: Partial<Customer>) => {
    try {
      const updatedCustomer = await customersAPI.update(id, updates);
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? updatedCustomer : customer
      ));
      toast({
        title: "הצלחה",
        description: "הלקוח עודכן בהצלחה",
      });
      return updatedCustomer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בעדכון הלקוח';
      console.error('Error updating customer:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      await customersAPI.delete(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast({
        title: "הצלחה",
        description: "הלקוח נמחק בהצלחה",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה במחיקת הלקוח';
      console.error('Error deleting customer:', err);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers,
  };
};
