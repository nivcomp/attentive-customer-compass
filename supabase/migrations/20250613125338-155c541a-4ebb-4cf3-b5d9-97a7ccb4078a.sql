
-- יצירת טבלה לבורדים
CREATE TABLE IF NOT EXISTS public.dynamic_boards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- יצירת טבלה לעמודות הבורד
CREATE TABLE IF NOT EXISTS public.dynamic_board_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES public.dynamic_boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  column_type TEXT NOT NULL DEFAULT 'text' CHECK (column_type IN ('text', 'number', 'date', 'single_select', 'multi_select', 'status')),
  column_order INTEGER NOT NULL DEFAULT 0,
  options JSONB DEFAULT '{}',
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- יצירת טבלה לרשומות הבורד
CREATE TABLE IF NOT EXISTS public.dynamic_board_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES public.dynamic_boards(id) ON DELETE CASCADE,
  item_order INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- הוספת RLS policies
ALTER TABLE public.dynamic_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_board_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_board_items ENABLE ROW LEVEL SECURITY;

-- Policy לכל הפעולות (ללא אימות לפי דרישה)
CREATE POLICY "Allow all operations on dynamic_boards" ON public.dynamic_boards
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on dynamic_board_columns" ON public.dynamic_board_columns
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on dynamic_board_items" ON public.dynamic_board_items
  FOR ALL USING (true) WITH CHECK (true);

-- יצירת אינדקסים לביצועים טובים יותר
CREATE INDEX IF NOT EXISTS idx_dynamic_board_columns_board_id ON public.dynamic_board_columns(board_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_board_columns_order ON public.dynamic_board_columns(board_id, column_order);
CREATE INDEX IF NOT EXISTS idx_dynamic_board_items_board_id ON public.dynamic_board_items(board_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_board_items_order ON public.dynamic_board_items(board_id, item_order);
