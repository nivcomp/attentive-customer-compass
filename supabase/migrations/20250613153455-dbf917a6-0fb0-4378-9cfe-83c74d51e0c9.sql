
-- יצירת טבלת tenants במסד הראשי
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  schema_name TEXT NOT NULL UNIQUE,
  subdomain TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- הוספת RLS policies לטבלת tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- policy שמאפשר לכולם לקרוא את הטנאנטים (לצורך זיהוי)
CREATE POLICY "Allow read access to tenants" ON public.tenants
  FOR SELECT USING (true);

-- פונקציה ליצירת schema חדש לטנאנט
CREATE OR REPLACE FUNCTION public.create_tenant_schema(
  tenant_name TEXT,
  tenant_subdomain TEXT
) RETURNS UUID AS $$
DECLARE
  tenant_id UUID;
  schema_name TEXT;
BEGIN
  -- יצירת שם schema ייחודי
  schema_name := 'tenant_' || replace(lower(tenant_subdomain), '-', '_');
  
  -- הוספת הטנאנט לטבלה
  INSERT INTO public.tenants (name, schema_name, subdomain)
  VALUES (tenant_name, schema_name, tenant_subdomain)
  RETURNING id INTO tenant_id;
  
  -- יצירת Schema חדש
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
  
  -- יצירת טבלאות בסיס בסכמה החדשה
  EXECUTE format('
    CREATE TABLE %I.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )', schema_name);
  
  EXECUTE format('
    CREATE TABLE %I.projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT ''active'',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )', schema_name);
  
  RETURN tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- פונקציה לקבלת מידע על טנאנט לפי subdomain
CREATE OR REPLACE FUNCTION public.get_tenant_by_subdomain(
  tenant_subdomain TEXT
) RETURNS TABLE (
  id UUID,
  name TEXT,
  schema_name TEXT,
  subdomain TEXT,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.name, t.schema_name, t.subdomain, t.is_active
  FROM public.tenants t
  WHERE t.subdomain = tenant_subdomain AND t.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- יצירת 2 טנאנטים לדוגמה
SELECT public.create_tenant_schema('Demo Company 1', 'demo1');
SELECT public.create_tenant_schema('Demo Company 2', 'demo2');

-- הוספת נתונים לדוגמה לטנאנט הראשון
INSERT INTO tenant_demo1.users (name, email) VALUES 
  ('John Doe', 'john@demo1.com'),
  ('Jane Smith', 'jane@demo1.com');

INSERT INTO tenant_demo1.projects (name, description, status) VALUES 
  ('Project Alpha', 'First project for demo1', 'active'),
  ('Project Beta', 'Second project for demo1', 'completed');

-- הוספת נתונים לדוגמה לטנאנט השני
INSERT INTO tenant_demo2.users (name, email) VALUES 
  ('Alice Johnson', 'alice@demo2.com'),
  ('Bob Wilson', 'bob@demo2.com');

INSERT INTO tenant_demo2.projects (name, description, status) VALUES 
  ('Project Gamma', 'First project for demo2', 'active'),
  ('Project Delta', 'Second project for demo2', 'planning');
