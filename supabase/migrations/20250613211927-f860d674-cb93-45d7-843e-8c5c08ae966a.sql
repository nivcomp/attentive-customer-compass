
-- יצירת טבלת אוטומציות
CREATE TABLE public.board_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES public.dynamic_boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('record_created', 'field_changed', 'date_reached', 'record_updated')),
  trigger_config JSONB NOT NULL DEFAULT '{}',
  action_type TEXT NOT NULL CHECK (action_type IN ('update_field', 'send_notification', 'create_record', 'create_task')),
  action_config JSONB NOT NULL DEFAULT '{}',
  condition_config JSONB DEFAULT '{}', -- תנאים אופציונליים
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- יצירת טבלת לוג אוטומציות
CREATE TABLE public.automation_execution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES public.board_automations(id) ON DELETE CASCADE,
  triggered_by_item_id UUID, -- הפריט שהפעיל את האוטומציה
  trigger_data JSONB DEFAULT '{}',
  action_result JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  execution_time_ms INTEGER
);

-- יצירת טבלת תבניות תהליכים
CREATE TABLE public.workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  template_data JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- הוספת indexes לביצועים
CREATE INDEX idx_board_automations_board_id ON public.board_automations(board_id);
CREATE INDEX idx_board_automations_active ON public.board_automations(is_active);
CREATE INDEX idx_automation_log_automation_id ON public.automation_execution_log(automation_id);
CREATE INDEX idx_automation_log_executed_at ON public.automation_execution_log(executed_at);

-- הכנסת תבניות אוטומציה מוכנות
INSERT INTO public.workflow_templates (name, description, category, template_data) VALUES
(
  'תהליך מכירות',
  'מליד לעסקה סגורה',
  'sales',
  '{
    "steps": [
      {"name": "ליד חדש", "status": "new_lead"},
      {"name": "פגישה נקבעה", "status": "meeting_scheduled"},
      {"name": "הצעה נשלחה", "status": "proposal_sent"},
      {"name": "עסקה נסגרה", "status": "deal_closed"}
    ],
    "automations": [
      {
        "name": "יצירת לקוח מעסקה סגורה",
        "trigger": "field_changed",
        "trigger_config": {"field": "status", "value": "deal_closed"},
        "action": "create_record",
        "action_config": {"target_board": "customers"}
      }
    ]
  }'
),
(
  'תהליך גיוס',
  'מקורות חיים להחלטה סופית',
  'hr',
  '{
    "steps": [
      {"name": "קורות חיים התקבלו", "status": "cv_received"},
      {"name": "ראיון ראשוני", "status": "first_interview"},
      {"name": "ראיון מקצועי", "status": "tech_interview"},
      {"name": "החלטה סופית", "status": "final_decision"}
    ],
    "automations": [
      {
        "name": "התראה על ראיון מתקרב",
        "trigger": "date_reached",
        "trigger_config": {"field": "interview_date", "days_before": 1},
        "action": "send_notification",
        "action_config": {"message": "ראיון מתוכנן מחר"}
      }
    ]
  }'
),
(
  'תהליך פרויקט',
  'מהזמנה לאישור סופי',
  'project',
  '{
    "steps": [
      {"name": "הזמנה התקבלה", "status": "order_received"},
      {"name": "תכנון", "status": "planning"},
      {"name": "ביצוע", "status": "execution"},
      {"name": "אישור לקוח", "status": "client_approval"}
    ],
    "automations": [
      {
        "name": "יצירת משימות תכנון",
        "trigger": "field_changed",
        "trigger_config": {"field": "status", "value": "planning"},
        "action": "create_record",
        "action_config": {"target_board": "tasks"}
      }
    ]
  }'
);
