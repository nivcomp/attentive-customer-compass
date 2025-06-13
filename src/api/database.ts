import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions from the database
type Customer = Database['public']['Tables']['customers']['Row'];
type Activity = Database['public']['Tables']['activities']['Row'];
type Contact = Database['public']['Tables']['contacts']['Row'];
type Deal = Database['public']['Tables']['deals']['Row'];
type Automation = Database['public']['Tables']['automations']['Row'];
type AutomationLog = Database['public']['Tables']['automation_logs']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];
type CustomField = Database['public']['Tables']['custom_fields']['Row'];
type CustomFieldValue = Database['public']['Tables']['custom_field_values']['Row'];

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

// API functions for companies
export const companiesAPI = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async create(company: Omit<Company, 'id' | 'created_at'>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Omit<Partial<Company>, 'id' | 'created_at'>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('companies')
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

// API functions for automations
export const automationsAPI = {
  async getAll(): Promise<Automation[]> {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Automation | null> {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async create(automation: Omit<Automation, 'id' | 'created_at' | 'updated_at'>): Promise<Automation> {
    const { data, error } = await supabase
      .from('automations')
      .insert([automation])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Omit<Partial<Automation>, 'id' | 'created_at' | 'updated_at'>): Promise<Automation> {
    const { data, error } = await supabase
      .from('automations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('automations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggle(id: string, isActive: boolean): Promise<Automation> {
    const { data, error } = await supabase
      .from('automations')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// API functions for automation logs
export const automationLogsAPI = {
  async getByAutomationId(automationId: string): Promise<AutomationLog[]> {
    const { data, error } = await supabase
      .from('automation_logs')
      .select('*')
      .eq('automation_id', automationId)
      .order('executed_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(log: Omit<AutomationLog, 'id' | 'executed_at'>): Promise<AutomationLog> {
    const { data, error } = await supabase
      .from('automation_logs')
      .insert([log])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRecentLogs(limit: number = 50): Promise<AutomationLog[]> {
    const { data, error } = await supabase
      .from('automation_logs')
      .select(`
        *,
        automations:automation_id (
          name
        )
      `)
      .order('executed_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }
};

// API functions for custom fields
export const customFieldsAPI = {
  async getByEntityType(entityType: string): Promise<CustomField[]> {
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('entity_type', entityType)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(field: Omit<CustomField, 'id' | 'created_at'>): Promise<CustomField> {
    const { data, error } = await supabase
      .from('custom_fields')
      .insert([field])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// API functions for custom field values
export const customFieldValuesAPI = {
  async getByEntity(entityType: string, entityId: number): Promise<CustomFieldValue[]> {
    const { data, error } = await supabase
      .from('custom_field_values')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);
    
    if (error) throw error;
    return data || [];
  },

  async upsert(value: Omit<CustomFieldValue, 'id' | 'created_at' | 'updated_at'>): Promise<CustomFieldValue> {
    const { data, error } = await supabase
      .from('custom_field_values')
      .upsert([{ ...value, updated_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Export types for use in components
export type { Customer, Activity, Contact, Deal, Automation, AutomationLog, Company, CustomField, CustomFieldValue };
