
import { supabase } from '@/integrations/supabase/client';

export interface BoardRelationship {
  id: string;
  source_board_id: string;
  target_board_id: string;
  relationship_type: 'one_to_many' | 'many_to_many' | 'one_to_one';
  source_field_name: string;
  target_field_name: string;
  created_at: string;
}

export interface ItemRelationship {
  id: string;
  relationship_id: string;
  source_item_id: string;
  target_item_id: string;
  created_at: string;
}

export const boardRelationshipsAPI = {
  async getAll(): Promise<BoardRelationship[]> {
    const { data, error } = await supabase
      .from('board_relationships')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as BoardRelationship[];
  },

  async getBySourceBoard(boardId: string): Promise<BoardRelationship[]> {
    const { data, error } = await supabase
      .from('board_relationships')
      .select('*')
      .eq('source_board_id', boardId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as BoardRelationship[];
  },

  async getByTargetBoard(boardId: string): Promise<BoardRelationship[]> {
    const { data, error } = await supabase
      .from('board_relationships')
      .select('*')
      .eq('target_board_id', boardId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as BoardRelationship[];
  },

  async create(relationship: Omit<BoardRelationship, 'id' | 'created_at'>): Promise<BoardRelationship> {
    const { data, error } = await supabase
      .from('board_relationships')
      .insert([relationship])
      .select()
      .single();
    
    if (error) throw error;
    return data as BoardRelationship;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('board_relationships')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const itemRelationshipsAPI = {
  async getByRelationship(relationshipId: string): Promise<ItemRelationship[]> {
    const { data, error } = await supabase
      .from('item_relationships')
      .select('*')
      .eq('relationship_id', relationshipId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as ItemRelationship[];
  },

  async getBySourceItem(sourceItemId: string): Promise<ItemRelationship[]> {
    const { data, error } = await supabase
      .from('item_relationships')
      .select('*')
      .eq('source_item_id', sourceItemId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as ItemRelationship[];
  },

  async getByTargetItem(targetItemId: string): Promise<ItemRelationship[]> {
    const { data, error } = await supabase
      .from('item_relationships')
      .select('*')
      .eq('target_item_id', targetItemId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as ItemRelationship[];
  },

  async create(relationship: Omit<ItemRelationship, 'id' | 'created_at'>): Promise<ItemRelationship> {
    const { data, error } = await supabase
      .from('item_relationships')
      .insert([relationship])
      .select()
      .single();
    
    if (error) throw error;
    return data as ItemRelationship;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('item_relationships')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteByItems(sourceItemId: string, targetItemId: string): Promise<void> {
    const { error } = await supabase
      .from('item_relationships')
      .delete()
      .eq('source_item_id', sourceItemId)
      .eq('target_item_id', targetItemId);
    
    if (error) throw error;
  }
};
