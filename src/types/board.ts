
export interface Board {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface BoardColumn {
  id: string;
  board_id: string;
  name: string;
  column_type: 'text' | 'number' | 'date' | 'select' | 'status';
  column_order: number;
  options?: any;
  is_required: boolean;
  created_at: string;
}

export interface BoardItem {
  id: string;
  board_id: string;
  item_order: number;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BoardView {
  id: string;
  board_id: string;
  name: string;
  view_type: 'table' | 'kanban' | 'calendar';
  settings: Record<string, any>;
  is_default: boolean;
  created_at: string;
}
