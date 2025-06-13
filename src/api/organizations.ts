
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface Organization {
  id: string;
  name: string;
  subdomain: string;
  settings: Json;
  created_at: string;
  logo_url?: string | null;
  primary_color?: string;
  secondary_color?: string;
  board_creation_policy?: string;
  default_board_permission?: string;
  require_board_approval?: boolean;
  allowed_email_domains?: string[] | null;
  restrict_invitations_to_admins?: boolean;
  session_timeout_hours?: number;
}

export interface OrganizationUser {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  status: string;
  joined_at: string;
}

// API functions for organizations
export const organizationsAPI = {
  async getAll(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBySubdomain(subdomain: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('subdomain', subdomain)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(name: string, subdomain: string): Promise<string> {
    const { data, error } = await supabase
      .rpc('create_organization', { 
        org_name: name, 
        org_subdomain: subdomain 
      });
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Organization>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMembers(organizationId: string): Promise<OrganizationUser[]> {
    const { data, error } = await supabase
      .from('organization_users')
      .select('*')
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addMember(organizationId: string, userId: string, role: string = 'member'): Promise<OrganizationUser> {
    const { data, error } = await supabase
      .from('organization_users')
      .insert([{
        organization_id: organizationId,
        user_id: userId,
        role
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateMemberRole(id: string, role: string): Promise<OrganizationUser> {
    const { data, error } = await supabase
      .from('organization_users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('organization_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
