
import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  name: string;
  schema_name: string;
  subdomain: string;
  is_active: boolean;
  created_at?: string;
}

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface TenantProject {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
}

// API functions for tenants
export const tenantsAPI = {
  async getAll(): Promise<Tenant[]> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getBySubdomain(subdomain: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .rpc('get_tenant_by_subdomain', { tenant_subdomain: subdomain });
    
    if (error) throw error;
    return data?.[0] || null;
  },

  async create(name: string, subdomain: string): Promise<string> {
    const { data, error } = await supabase
      .rpc('create_tenant_schema', { 
        tenant_name: name, 
        tenant_subdomain: subdomain 
      });
    
    if (error) throw error;
    return data;
  },

  async getTenantUsers(schemaName: string): Promise<TenantUser[]> {
    const { data, error } = await supabase
      .from(`${schemaName}.users`)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getTenantProjects(schemaName: string): Promise<TenantProject[]> {
    const { data, error } = await supabase
      .from(`${schemaName}.projects`)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createTenantUser(schemaName: string, user: Omit<TenantUser, 'id' | 'created_at'>): Promise<TenantUser> {
    const { data, error } = await supabase
      .from(`${schemaName}.users`)
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createTenantProject(schemaName: string, project: Omit<TenantProject, 'id' | 'created_at'>): Promise<TenantProject> {
    const { data, error } = await supabase
      .from(`${schemaName}.projects`)
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
