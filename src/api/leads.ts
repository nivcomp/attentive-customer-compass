
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id: string;
  name: string;
  source: string;
  status: 'new' | 'in_progress' | 'converted' | 'rejected';
  rating?: number;
  notes?: string;
  converted_to_board_id?: string;
  converted_to_item_id?: string;
  converted_at?: string;
  created_at: string;
  updated_at: string;
}

export const leadsAPI = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Lead[];
  },

  async getById(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data as Lead | null;
  },

  async create(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();
    
    if (error) throw error;
    return data as Lead;
  },

  async update(id: string, updates: Partial<Omit<Lead, 'id' | 'created_at'>>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lead;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async convertLead(
    leadId: string, 
    targetBoardId: string, 
    leadData: Record<string, any>
  ): Promise<{ lead: Lead; newItem: any }> {
    // Create new item in target board
    const { data: newItem, error: itemError } = await supabase
      .from('dynamic_board_items')
      .insert([{
        board_id: targetBoardId,
        data: leadData,
        item_order: 0
      }])
      .select()
      .single();

    if (itemError) throw itemError;

    // Update lead status to converted
    const { data: updatedLead, error: leadError } = await supabase
      .from('leads')
      .update({
        status: 'converted',
        converted_to_board_id: targetBoardId,
        converted_to_item_id: newItem.id,
        converted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select()
      .single();

    if (leadError) throw leadError;

    return { lead: updatedLead as Lead, newItem };
  }
};
