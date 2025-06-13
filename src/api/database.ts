
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions from the database
type Customer = Database['public']['Tables']['customers']['Row'];
type Activity = Database['public']['Tables']['activities']['Row'];
type Contact = Database['public']['Tables']['contacts']['Row'];
type Deal = Database['public']['Tables']['deals']['Row'];

// API functions for customers
export const customersAPI = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async create(customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Omit<Partial<Customer>, 'id' | 'created_at'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API functions for activities
export const activitiesAPI = {
  async getAll(): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByCustomerId(customerId: number): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert([activity])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// API functions for contacts
export const contactsAPI = {
  async getAll(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByCustomerId(customerId: number): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(contact: Omit<Contact, 'id' | 'created_at'>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// API functions for deals
export const dealsAPI = {
  async getAll(): Promise<Deal[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByCustomerId(customerId: number): Promise<Deal[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(deal: Omit<Deal, 'id' | 'created_at'>): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .insert([deal])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: number, status: string): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Export types for use in components
export type { Customer, Activity, Contact, Deal };
