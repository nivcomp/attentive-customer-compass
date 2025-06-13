
-- יצירת טבלת audit log לעקיבה אחר פעולות במערכת
CREATE TABLE public.organization_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'board_created', 'user_invited', 'role_changed', 'user_removed', etc.
  target_id UUID, -- ID של האובייקט המושפע (board_id, user_id וכו')
  target_type TEXT, -- 'board', 'user', 'organization'
  details JSONB DEFAULT '{}', -- פרטים נוספים על הפעולה
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- הוספת הגדרות נוספות לטבלת ארגונים
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#3B82F6',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#1E40AF',
ADD COLUMN IF NOT EXISTS board_creation_policy TEXT DEFAULT 'everyone' CHECK (board_creation_policy IN ('everyone', 'admins_only')),
ADD COLUMN IF NOT EXISTS default_board_permission TEXT DEFAULT 'view' CHECK (default_board_permission IN ('view', 'edit', 'admin')),
ADD COLUMN IF NOT EXISTS require_board_approval BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS allowed_email_domains TEXT[], -- מערך של דומיינים מורשים
ADD COLUMN IF NOT EXISTS restrict_invitations_to_admins BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS session_timeout_hours INTEGER DEFAULT 24;

-- הוספת indexes לביצועים
CREATE INDEX IF NOT EXISTS idx_audit_log_org_id ON public.organization_audit_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.organization_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_performed_at ON public.organization_audit_log(performed_at);

-- הפעלת RLS על טבלת audit log
ALTER TABLE public.organization_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policy עבור audit log - רק חברי ארגון יכולים לראות לוגים של הארגון שלהם
CREATE POLICY "Organization members can view audit logs" 
  ON public.organization_audit_log 
  FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- רק מנהלים יכולים להוסיף לוגים (למעשה הפונקציות יעשו זאת)
CREATE POLICY "System can insert audit logs" 
  ON public.organization_audit_log 
  FOR INSERT 
  WITH CHECK (true);

-- פונקציה להוספת לוג אודיט
CREATE OR REPLACE FUNCTION public.add_audit_log(
  org_id UUID,
  action_type TEXT,
  target_id UUID DEFAULT NULL,
  target_type TEXT DEFAULT NULL,
  details JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.organization_audit_log (
    organization_id,
    user_id,
    action_type,
    target_id,
    target_type,
    details
  ) VALUES (
    org_id,
    auth.uid(),
    action_type,
    target_id,
    target_type,
    details
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- פונקציה לבדיקת הרשאות ארגון
CREATE OR REPLACE FUNCTION public.check_organization_permission(
  org_id UUID,
  user_id UUID,
  required_role TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.organization_users
  WHERE organization_id = org_id 
  AND user_id = user_id 
  AND status = 'active';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- היררכיית תפקידים: owner > admin > member
  CASE required_role
    WHEN 'member' THEN
      RETURN user_role IN ('owner', 'admin', 'member');
    WHEN 'admin' THEN
      RETURN user_role IN ('owner', 'admin');
    WHEN 'owner' THEN
      RETURN user_role = 'owner';
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$;
