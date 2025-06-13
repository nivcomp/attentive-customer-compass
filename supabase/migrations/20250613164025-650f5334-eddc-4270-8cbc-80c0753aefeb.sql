
-- יצירת טבלת ארגונים
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- יצירת טבלת משתמשי ארגון
CREATE TABLE public.organization_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- הוספת indexes לביצועים טובים יותר
CREATE INDEX idx_organizations_subdomain ON public.organizations(subdomain);
CREATE INDEX idx_org_users_user_id ON public.organization_users(user_id);
CREATE INDEX idx_org_users_org_id ON public.organization_users(organization_id);

-- הפעלת RLS על הטבלאות
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;

-- RLS policies עבור טבלת organizations
-- משתמשים רואים רק ארגונים שהם חברים בהם
CREATE POLICY "Users can view organizations they belong to" 
  ON public.organizations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_users 
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

-- רק מנהלים יכולים ליצור ארגונים חדשים
CREATE POLICY "Admins can create organizations" 
  ON public.organizations 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- רק מנהלי ארגון יכולים לעדכן הגדרות
CREATE POLICY "Organization admins can update" 
  ON public.organizations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_users 
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner')
      AND status = 'active'
    )
  );

-- RLS policies עבור טבלת organization_users
-- משתמשים רואים חברי ארגון רק אם הם עצמם חברים באותו ארגון
CREATE POLICY "Users can view org members if they belong to same org" 
  ON public.organization_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_users ou 
      WHERE ou.organization_id = organization_users.organization_id 
      AND ou.user_id = auth.uid() 
      AND ou.status = 'active'
    )
  );

-- משתמשים יכולים להצטרף לארגון
CREATE POLICY "Users can join organizations" 
  ON public.organization_users 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- רק מנהלים יכולים לעדכן תפקידים וסטטוס
CREATE POLICY "Admins can update member roles and status" 
  ON public.organization_users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_users ou 
      WHERE ou.organization_id = organization_users.organization_id 
      AND ou.user_id = auth.uid() 
      AND ou.role IN ('admin', 'owner')
      AND ou.status = 'active'
    )
  );

-- משתמשים יכולים לעזוב ארגון (למחוק את עצמם)
CREATE POLICY "Users can leave organizations" 
  ON public.organization_users 
  FOR DELETE 
  USING (user_id = auth.uid());

-- פונקציה ליצירת ארגון חדש עם המשתמש כבעלים
CREATE OR REPLACE FUNCTION public.create_organization(
  org_name TEXT,
  org_subdomain TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- יצירת הארגון
  INSERT INTO public.organizations (name, subdomain)
  VALUES (org_name, org_subdomain)
  RETURNING id INTO new_org_id;
  
  -- הוספת המשתמש כבעלים
  INSERT INTO public.organization_users (user_id, organization_id, role)
  VALUES (auth.uid(), new_org_id, 'owner');
  
  RETURN new_org_id;
END;
$$;

-- יצירת 2 ארגונים לדוגמה (יש להריץ אחרי שמשתמש מתחבר)
-- INSERT INTO public.organizations (name, subdomain) VALUES 
--   ('חברת הדמו', 'demo-company'),
--   ('סטארט-אפ חדשני', 'innovative-startup');
