
-- טבלה לניהול קשרים בין בורדים
CREATE TABLE public.board_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_board_id UUID REFERENCES dynamic_boards(id) ON DELETE CASCADE,
  target_board_id UUID REFERENCES dynamic_boards(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('one_to_many', 'many_to_many', 'one_to_one')),
  source_field_name TEXT NOT NULL,
  target_field_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(source_board_id, target_board_id, source_field_name)
);

-- טבלה לאחסון קשרים בפועל בין רשומות
CREATE TABLE public.item_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relationship_id UUID REFERENCES board_relationships(id) ON DELETE CASCADE,
  source_item_id UUID REFERENCES dynamic_board_items(id) ON DELETE CASCADE,
  target_item_id UUID REFERENCES dynamic_board_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(relationship_id, source_item_id, target_item_id)
);

-- אינדקסים לביצועים טובים
CREATE INDEX idx_board_relationships_source ON board_relationships(source_board_id);
CREATE INDEX idx_board_relationships_target ON board_relationships(target_board_id);
CREATE INDEX idx_item_relationships_source ON item_relationships(source_item_id);
CREATE INDEX idx_item_relationships_target ON item_relationships(target_item_id);
CREATE INDEX idx_item_relationships_relationship ON item_relationships(relationship_id);
