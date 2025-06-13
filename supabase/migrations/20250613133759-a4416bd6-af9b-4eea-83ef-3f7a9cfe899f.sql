
-- הוספת סוגי שדות חדשים לטבלת dynamic_board_columns
ALTER TABLE dynamic_board_columns 
DROP CONSTRAINT IF EXISTS dynamic_board_columns_column_type_check;

-- הוספת constraint חדש עם כל סוגי השדות הנתמכים
ALTER TABLE dynamic_board_columns 
ADD CONSTRAINT dynamic_board_columns_column_type_check 
CHECK (column_type IN (
  'text', 'number', 'date', 
  'single_select', 'multi_select', 'status',
  'file', 'image', 'board_link'
));

-- הוספת עמודה לקישור לבורד אחר (עבור שדות board_link)
ALTER TABLE dynamic_board_columns 
ADD COLUMN linked_board_id UUID REFERENCES dynamic_boards(id);

-- הוספת עמודות נוספות למטאדטה של השדה
ALTER TABLE dynamic_board_columns 
ADD COLUMN validation_rules JSONB DEFAULT '{}'::jsonb,
ADD COLUMN display_settings JSONB DEFAULT '{}'::jsonb;

-- יצירת אינדקס לביצועים טובים יותר
CREATE INDEX IF NOT EXISTS idx_dynamic_board_columns_linked_board 
ON dynamic_board_columns(linked_board_id) WHERE linked_board_id IS NOT NULL;
