
-- Create a table for custom boards
CREATE TABLE public.boards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for board columns with customizable properties
CREATE TABLE public.board_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  column_type TEXT NOT NULL DEFAULT 'text', -- text, number, date, select, status
  column_order INTEGER NOT NULL DEFAULT 0,
  options JSONB, -- For dropdown options, colors, etc.
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for board items (rows)
CREATE TABLE public.board_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE,
  item_order INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}', -- Flexible data storage for all column values
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for board views (table, kanban, calendar)
CREATE TABLE public.board_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  view_type TEXT NOT NULL DEFAULT 'table', -- table, kanban, calendar
  settings JSONB NOT NULL DEFAULT '{}', -- View-specific settings
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_views ENABLE ROW LEVEL SECURITY;

-- Boards policies
CREATE POLICY "Users can view their own boards" ON public.boards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own boards" ON public.boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own boards" ON public.boards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own boards" ON public.boards FOR DELETE USING (auth.uid() = user_id);

-- Board columns policies
CREATE POLICY "Users can view columns of their boards" ON public.board_columns FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_columns.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can create columns for their boards" ON public.board_columns FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_columns.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can update columns of their boards" ON public.board_columns FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_columns.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can delete columns of their boards" ON public.board_columns FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_columns.board_id AND boards.user_id = auth.uid())
);

-- Board items policies
CREATE POLICY "Users can view items of their boards" ON public.board_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_items.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can create items for their boards" ON public.board_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_items.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can update items of their boards" ON public.board_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_items.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can delete items of their boards" ON public.board_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_items.board_id AND boards.user_id = auth.uid())
);

-- Board views policies
CREATE POLICY "Users can view views of their boards" ON public.board_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_views.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can create views for their boards" ON public.board_views FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_views.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can update views of their boards" ON public.board_views FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_views.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can delete views of their boards" ON public.board_views FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_views.board_id AND boards.user_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX idx_board_columns_board_id ON public.board_columns(board_id);
CREATE INDEX idx_board_columns_order ON public.board_columns(board_id, column_order);
CREATE INDEX idx_board_items_board_id ON public.board_items(board_id);
CREATE INDEX idx_board_items_order ON public.board_items(board_id, item_order);
CREATE INDEX idx_board_views_board_id ON public.board_views(board_id);
