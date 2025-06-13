
import { supabase } from '@/integrations/supabase/client';

export interface Board {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  organization_id?: string;
  visibility: 'private' | 'organization' | 'custom';
  board_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BoardPermission {
  id: string;
  board_id: string;
  user_id: string;
  permission_type: 'view' | 'edit' | 'admin';
  granted_by?: string;
  granted_at: string;
}

// API functions for boards with permissions
export const boardsAPI = {
  async getAll(): Promise<Board[]> {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(board => ({
      ...board,
      visibility: board.visibility as 'private' | 'organization' | 'custom',
      board_config: (board.board_config as Record<string, any>) || {}
    }));
  },

  async getById(id: string): Promise<Board | null> {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? {
      ...data,
      visibility: data.visibility as 'private' | 'organization' | 'custom',
      board_config: (data.board_config as Record<string, any>) || {}
    } : null;
  },

  async create(board: Omit<Board, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('boards')
      .insert([{
        ...board,
        owner_id: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      visibility: data.visibility as 'private' | 'organization' | 'custom',
      board_config: (data.board_config as Record<string, any>) || {}
    };
  },

  async update(id: string, updates: Partial<Board>): Promise<Board> {
    const { data, error } = await supabase
      .from('boards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      visibility: data.visibility as 'private' | 'organization' | 'custom',
      board_config: (data.board_config as Record<string, any>) || {}
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Board permissions methods
  async getBoardPermissions(boardId: string): Promise<BoardPermission[]> {
    const { data, error } = await supabase
      .from('board_permissions')
      .select('*')
      .eq('board_id', boardId)
      .order('granted_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(permission => ({
      ...permission,
      permission_type: permission.permission_type as 'view' | 'edit' | 'admin'
    }));
  },

  async addPermission(
    boardId: string, 
    userId: string, 
    permissionType: 'view' | 'edit' | 'admin'
  ): Promise<BoardPermission> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('board_permissions')
      .insert([{
        board_id: boardId,
        user_id: userId,
        permission_type: permissionType,
        granted_by: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      permission_type: data.permission_type as 'view' | 'edit' | 'admin'
    };
  },

  async updatePermission(
    id: string, 
    permissionType: 'view' | 'edit' | 'admin'
  ): Promise<BoardPermission> {
    const { data, error } = await supabase
      .from('board_permissions')
      .update({ permission_type: permissionType })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      permission_type: data.permission_type as 'view' | 'edit' | 'admin'
    };
  },

  async removePermission(id: string): Promise<void> {
    const { error } = await supabase
      .from('board_permissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async checkBoardPermission(
    boardId: string, 
    requiredPermission: 'view' | 'edit' | 'admin'
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .rpc('check_board_permission', {
        board_uuid: boardId,
        user_uuid: user.id,
        required_permission: requiredPermission
      });
    
    if (error) throw error;
    return data || false;
  }
};
