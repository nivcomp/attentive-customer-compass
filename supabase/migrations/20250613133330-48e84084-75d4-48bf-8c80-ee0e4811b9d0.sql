
-- יצירת טבלה מיוחדת ללידים
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'web',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'converted', 'rejected')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  converted_to_board_id UUID REFERENCES dynamic_boards(id),
  converted_to_item_id UUID REFERENCES dynamic_board_items(id),
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- אינדקסים לביצועים טובים
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- הוספת RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- מדיניות שמאפשרת גישה לכל המשתמשים (ניתן לשנות בהמשך)
CREATE POLICY "Enable all access for leads" ON public.leads FOR ALL USING (true);
