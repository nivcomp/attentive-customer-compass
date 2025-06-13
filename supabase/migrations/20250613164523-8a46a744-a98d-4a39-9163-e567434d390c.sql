
-- בדיקה ועדכון טבלת boards הקיימת עם עמודות הרשאות
-- הוספת עמודות חדשות לטבלת boards הקיימת
ALTER TABLE public.boards 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'organization', 'custom')),
ADD COLUMN IF NOT EXISTS board_config JSONB DEFAULT '{}';

-- עדכון עמודות קיימות במידת הצורך
ALTER TABLE public.boards 
ALTER COLUMN owner_id SET NOT NULL;

-- יצירת טבלת board_permissions להרשאות ספציפיות (אם לא קיימת)
CREATE TABLE IF NOT EXISTS public.board_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission_type TEXT NOT NULL CHECK (permission_type IN ('view', 'edit', 'admin')),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(board_id, user_id)
);

-- יצירת indexes לביצועים (אם לא קיימים)
CREATE INDEX IF NOT EXISTS idx_boards_owner_id ON public.boards(owner_id);
CREATE INDEX IF NOT EXISTS idx_boards_organization_id ON public.boards(organization_id);
CREATE INDEX IF NOT EXISTS idx_boards_visibility ON public.boards(visibility);
CREATE INDEX IF NOT EXISTS idx_board_permissions_board_id ON public.board_permissions(board_id);
CREATE INDEX IF NOT EXISTS idx_board_permissions_user_id ON public.board_permissions(user_id);

-- הפעלת RLS על הטבלאות
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_permissions ENABLE ROW LEVEL SECURITY;

-- הסרת policies קיימות אם יש
DROP POLICY IF EXISTS "Users can view their own boards" ON public.boards;
DROP POLICY IF EXISTS "Users can view organization boards" ON public.boards;
DROP POLICY IF EXISTS "Users can view boards with specific permissions" ON public.boards;
DROP POLICY IF EXISTS "Users can create boards" ON public.boards;
DROP POLICY IF EXISTS "Board owners and admins can update" ON public.boards;
DROP POLICY IF EXISTS "Board owners can delete" ON public.boards;
DROP POLICY IF EXISTS "Users can view permissions for accessible boards" ON public.board_permissions;
DROP POLICY IF EXISTS "Board owners and admins can manage permissions" ON public.board_permissions;

-- RLS policies עבור טבלת boards
-- משתמשים יכולים לראות בורדים שהם בעלים שלהם
CREATE POLICY "Users can view their own boards" 
  ON public.boards 
  FOR SELECT 
  USING (owner_id = auth.uid());

-- משתמשים יכולים לראות בורדים ארגוניים של הארגון שלהם
CREATE POLICY "Users can view organization boards" 
  ON public.boards 
  FOR SELECT 
  USING (
    visibility = 'organization' 
    AND organization_id IN (
      SELECT organization_id 
      FROM public.organization_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- משתמשים יכולים לראות בורדים עם הרשאות ספציפיות
CREATE POLICY "Users can view boards with specific permissions" 
  ON public.boards 
  FOR SELECT 
  USING (
    visibility = 'custom' 
    AND id IN (
      SELECT board_id 
      FROM public.board_permissions 
      WHERE user_id = auth.uid()
    )
  );

-- רק בעלי בורדים יכולים ליצור בורדים
CREATE POLICY "Users can create boards" 
  ON public.boards 
  FOR INSERT 
  WITH CHECK (owner_id = auth.uid());

-- רק בעלים ומשתמשים עם הרשאת admin יכולים לעדכן
CREATE POLICY "Board owners and admins can update" 
  ON public.boards 
  FOR UPDATE 
  USING (
    owner_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.board_permissions 
      WHERE board_id = boards.id 
      AND user_id = auth.uid() 
      AND permission_type = 'admin'
    )
  );

-- רק בעלים יכולים למחוק בורדים
CREATE POLICY "Board owners can delete" 
  ON public.boards 
  FOR DELETE 
  USING (owner_id = auth.uid());

-- RLS policies עבור טבלת board_permissions
-- משתמשים יכולים לראות הרשאות של בורדים שהם בעלים שלהם או שיש להם הרשאות עליהם
CREATE POLICY "Users can view permissions for accessible boards" 
  ON public.board_permissions 
  FOR SELECT 
  USING (
    board_id IN (
      SELECT id FROM public.boards 
      WHERE owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- רק בעלי בורדים ומנהלים יכולים להוסיף הרשאות
CREATE POLICY "Board owners and admins can manage permissions" 
  ON public.board_permissions 
  FOR ALL
  USING (
    board_id IN (
      SELECT id FROM public.boards 
      WHERE owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.board_permissions bp 
      WHERE bp.board_id = board_permissions.board_id 
      AND bp.user_id = auth.uid() 
      AND bp.permission_type = 'admin'
    )
  )
  WITH CHECK (
    board_id IN (
      SELECT id FROM public.boards 
      WHERE owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.board_permissions bp 
      WHERE bp.board_id = board_permissions.board_id 
      AND bp.user_id = auth.uid() 
      AND bp.permission_type = 'admin'
    )
  );

-- פונקציה לבדיקת הרשאות בורד
CREATE OR REPLACE FUNCTION public.check_board_permission(
  board_uuid UUID,
  user_uuid UUID,
  required_permission TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  board_record RECORD;
  has_permission BOOLEAN := FALSE;
BEGIN
  -- קבלת מידע על הבורד
  SELECT * INTO board_record 
  FROM public.boards 
  WHERE id = board_uuid;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- בדיקה אם המשתמש הוא הבעלים
  IF board_record.owner_id = user_uuid THEN
    RETURN TRUE;
  END IF;
  
  -- בדיקה לפי סוג הנראות
  CASE board_record.visibility
    WHEN 'private' THEN
      RETURN FALSE;
    
    WHEN 'organization' THEN
      -- בדיקה אם המשתמש חבר בארגון
      SELECT EXISTS(
        SELECT 1 FROM public.organization_users 
        WHERE organization_id = board_record.organization_id 
        AND user_id = user_uuid 
        AND status = 'active'
      ) INTO has_permission;
      
    WHEN 'custom' THEN
      -- בדיקה של הרשאות ספציפיות
      CASE required_permission
        WHEN 'view' THEN
          SELECT EXISTS(
            SELECT 1 FROM public.board_permissions 
            WHERE board_id = board_uuid 
            AND user_id = user_uuid
          ) INTO has_permission;
        
        WHEN 'edit' THEN
          SELECT EXISTS(
            SELECT 1 FROM public.board_permissions 
            WHERE board_id = board_uuid 
            AND user_id = user_uuid 
            AND permission_type IN ('edit', 'admin')
          ) INTO has_permission;
        
        WHEN 'admin' THEN
          SELECT EXISTS(
            SELECT 1 FROM public.board_permissions 
            WHERE board_id = board_uuid 
            AND user_id = user_uuid 
            AND permission_type = 'admin'
          ) INTO has_permission;
      END CASE;
  END CASE;
  
  RETURN has_permission;
END;
$$;
