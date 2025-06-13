
-- Create automations table
CREATE TABLE public.automations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('status_change', 'date_reached', 'value_threshold')),
  trigger_config JSONB NOT NULL DEFAULT '{}',
  action_type TEXT NOT NULL CHECK (action_type IN ('send_email', 'create_reminder', 'move_stage')),
  action_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add some indexes for performance
CREATE INDEX idx_automations_trigger_type ON public.automations(trigger_type);
CREATE INDEX idx_automations_is_active ON public.automations(is_active);

-- Create automation_logs table to track execution
CREATE TABLE public.automation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  triggered_by_type TEXT NOT NULL,
  triggered_by_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_automation_logs_automation_id ON public.automation_logs(automation_id);
CREATE INDEX idx_automation_logs_executed_at ON public.automation_logs(executed_at);
