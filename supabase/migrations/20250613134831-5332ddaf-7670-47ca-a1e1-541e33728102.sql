
-- Create templates table
CREATE TABLE public.board_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users,
  template_data JSONB NOT NULL DEFAULT '{}',
  preview_image TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.board_templates ENABLE ROW LEVEL SECURITY;

-- Users can view public templates and their own templates
CREATE POLICY "Users can view public templates and own templates" 
  ON public.board_templates 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = created_by);

-- Users can create their own templates
CREATE POLICY "Users can create templates" 
  ON public.board_templates 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own templates
CREATE POLICY "Users can update own templates" 
  ON public.board_templates 
  FOR UPDATE 
  USING (auth.uid() = created_by);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" 
  ON public.board_templates 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Insert the basic CRM template
INSERT INTO public.board_templates (name, description, category, is_public, template_data) 
VALUES (
  'CRM בסיסי',
  'מערכת CRM בסיסית הכוללת חברות, אנשי קשר ועסקאות',
  'crm',
  true,
  '{
    "boards": [
      {
        "name": "חברות",
        "description": "ניהול חברות לקוח",
        "columns": [
          {"name": "שם החברה", "column_type": "text", "is_required": true, "column_order": 0},
          {"name": "תחום עיסוק", "column_type": "single_select", "options": {"choices": ["טכנולוגיה", "שירותים", "ייצור", "סחר", "אחר"]}, "column_order": 1},
          {"name": "טלפון", "column_type": "text", "column_order": 2},
          {"name": "אימייל", "column_type": "text", "column_order": 3},
          {"name": "כתובת", "column_type": "text", "column_order": 4},
          {"name": "סטטוס", "column_type": "status", "options": {"choices": [{"label": "פעיל", "color": "green"}, {"label": "לא פעיל", "color": "gray"}, {"label": "פוטנציאלי", "color": "blue"}]}, "column_order": 5}
        ],
        "sample_data": [
          {"שם החברה": "טכנולוגיות מתקדמות בע״מ", "תחום עיסוק": "טכנולוגיה", "טלפון": "03-1234567", "אימייל": "info@techco.co.il", "כתובת": "תל אביב", "סטטוס": "פעיל"},
          {"שם החברה": "שירותי יעוץ פרמיום", "תחום עיסוק": "שירותים", "טלפון": "02-9876543", "אימייל": "contact@premium.co.il", "כתובת": "ירושלים", "סטטוס": "פוטנציאלי"}
        ]
      },
      {
        "name": "אנשי קשר",
        "description": "ניהול אנשי קשר בחברות",
        "columns": [
          {"name": "שם מלא", "column_type": "text", "is_required": true, "column_order": 0},
          {"name": "תפקיד", "column_type": "text", "column_order": 1},
          {"name": "חברה", "column_type": "board_link", "linked_board_name": "חברות", "column_order": 2},
          {"name": "טלפון", "column_type": "text", "column_order": 3},
          {"name": "אימייל", "column_type": "text", "column_order": 4},
          {"name": "רמת קשר", "column_type": "single_select", "options": {"choices": ["חם", "פושר", "קר"]}, "column_order": 5}
        ],
        "sample_data": [
          {"שם מלא": "יוסי כהן", "תפקיד": "מנהל טכנולוגיות", "טלפון": "050-1234567", "אימייל": "yossi@techco.co.il", "רמת קשר": "חם"},
          {"שם מלא": "רחל לוי", "תפקיד": "מנהלת כללית", "טלפון": "052-9876543", "אימייל": "rachel@premium.co.il", "רמת קשר": "פושר"}
        ]
      },
      {
        "name": "עסקאות",
        "description": "ניהול עסקאות מכירה",
        "columns": [
          {"name": "שם העסקה", "column_type": "text", "is_required": true, "column_order": 0},
          {"name": "חברה", "column_type": "board_link", "linked_board_name": "חברות", "column_order": 1},
          {"name": "איש קשר", "column_type": "board_link", "linked_board_name": "אנשי קשר", "column_order": 2},
          {"name": "ערך", "column_type": "number", "column_order": 3},
          {"name": "שלב", "column_type": "single_select", "options": {"choices": ["ליד חדש", "בדיקת צרכים", "הצעת מחיר", "משא ומתן", "סגירה", "הושלם", "נכשל"]}, "column_order": 4},
          {"name": "הסתברות", "column_type": "single_select", "options": {"choices": ["25%", "50%", "75%", "90%"]}, "column_order": 5},
          {"name": "תאריך סגירה צפוי", "column_type": "date", "column_order": 6}
        ],
        "sample_data": [
          {"שם העסקה": "פרויקט דיגיטל טרנספורמיישן", "ערך": 120000, "שלב": "משא ומתן", "הסתברות": "75%", "תאריך סגירה צפוי": "2024-02-15"},
          {"שם העסקה": "ייעוץ אסטרטגי", "ערך": 45000, "שלב": "הצעת מחיר", "הסתברות": "50%", "תאריך סגירה צפוי": "2024-01-30"}
        ]
      }
    ],
    "relationships": [
      {
        "source_board": "אנשי קשר",
        "target_board": "חברות",
        "relationship_type": "many_to_one",
        "source_field": "חברה",
        "target_field": "שם החברה"
      },
      {
        "source_board": "עסקאות",
        "target_board": "חברות",
        "relationship_type": "many_to_one",
        "source_field": "חברה",
        "target_field": "שם החברה"
      },
      {
        "source_board": "עסקאות",
        "target_board": "אנשי קשר",
        "relationship_type": "many_to_one",
        "source_field": "איש קשר",
        "target_field": "שם מלא"
      }
    ]
  }'
);
