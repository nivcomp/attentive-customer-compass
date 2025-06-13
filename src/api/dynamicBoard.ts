
import { supabase } from '@/integrations/supabase/client';

// Type definitions for dynamic boards
export interface DynamicBoard {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DynamicBoardColumn {
  id: string;
  board_id: string;
  name: string;
  column_type: 'text' | 'number' | 'date' | 'single_select' | 'multi_select' | 'status';
  column_order: number;
  options?: any;
  is_required: boolean;
  created_at: string;
}

export interface DynamicBoardItem {
  id: string;
  board_id: string;
  item_order: number;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// API functions for dynamic boards
export const dynamicBoardsAPI = {
  async getAll(): Promise<DynamicBoard[]> {
    const { data, error } = await supabase
      .from('dynamic_boards')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<DynamicBoard | null> {
    const { data, error } = await supabase
      .from('dynamic_boards')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async create(board: Omit<DynamicBoard, 'id' | 'created_at' | 'updated_at'>): Promise<DynamicBoard> {
    const { data, error } = await supabase
      .from('dynamic_boards')
      .insert([board])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Omit<DynamicBoard, 'id' | 'created_at'>>): Promise<DynamicBoard> {
    const { data, error } = await supabase
      .from('dynamic_boards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('dynamic_boards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API functions for dynamic board columns
export const dynamicBoardColumnsAPI = {
  async getByBoardId(boardId: string): Promise<DynamicBoardColumn[]> {
    const { data, error } = await supabase
      .from('dynamic_board_columns')
      .select('*')
      .eq('board_id', boardId)
      .order('column_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(column: Omit<DynamicBoardColumn, 'id' | 'created_at'>): Promise<DynamicBoardColumn> {
    const { data, error } = await supabase
      .from('dynamic_board_columns')
      .insert([column])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Omit<DynamicBoardColumn, 'id' | 'created_at'>>): Promise<DynamicBoardColumn> {
    const { data, error } = await supabase
      .from('dynamic_board_columns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('dynamic_board_columns')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API functions for dynamic board items
export const dynamicBoardItemsAPI = {
  async getByBoardId(boardId: string): Promise<DynamicBoardItem[]> {
    const { data, error } = await supabase
      .from('dynamic_board_items')
      .select('*')
      .eq('board_id', boardId)
      .order('item_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(item: Omit<DynamicBoardItem, 'id' | 'created_at' | 'updated_at'>): Promise<DynamicBoardItem> {
    const { data, error } = await supabase
      .from('dynamic_board_items')
      .insert([item])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Omit<DynamicBoardItem, 'id' | 'created_at'>>): Promise<DynamicBoardItem> {
    const { data, error } = await supabase
      .from('dynamic_board_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('dynamic_board_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
