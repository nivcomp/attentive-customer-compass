
import { supabase } from '@/integrations/supabase/client';

export interface BoardTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_public: boolean;
  created_by?: string;
  template_data: any;
  preview_image?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// Updated SystemTemplate interface to match database schema
export interface SystemTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  template_data: any[];
  is_public: boolean;
  created_at: string;
}

export const boardTemplatesAPI = {
  async getAll(): Promise<BoardTemplate[]> {
    const { data, error } = await supabase
      .from('board_templates')
      .select('*')
      .order('usage_count', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getSystemTemplates(): Promise<SystemTemplate[]> {
    const { data, error } = await supabase
      .from('board_templates')
      .select('*')
      .eq('is_public', true)
      .order('category');
    
    if (error) throw error;
    return data || [];
  },

  async getByCategory(category: string): Promise<BoardTemplate[]> {
    const { data,error } = await supabase
      .from('board_templates')
      .select('*')
      .eq('category', category)
      .order('usage_count', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByBoardType(boardType: string): Promise<SystemTemplate[]> {
    const { data, error } = await supabase
      .from('board_templates')
      .select('*')
      .eq('category', boardType)
      .order('usage_count', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<BoardTemplate | null> {
    const { data, error } = await supabase
      .from('board_templates')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async create(template: Omit<BoardTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>): Promise<BoardTemplate> {
    const { data, error } = await supabase
      .from('board_templates')
      .insert([template])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Omit<BoardTemplate, 'id' | 'created_at'>>): Promise<BoardTemplate> {
    const { data, error } = await supabase
      .from('board_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('board_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async incrementUsage(id: string): Promise<void> {
    // Direct update approach since RPC function may not exist
    const { data: template } = await supabase
      .from('board_templates')
      .select('usage_count')
      .eq('id', id)
      .single();
    
    if (template) {
      const { error } = await supabase
        .from('board_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', id);
      
      if (error) throw error;
    }
  }
};
