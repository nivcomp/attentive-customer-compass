
-- Add RLS policies for customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create, read, update, and delete customers
-- This is for a simple CRM without authentication
CREATE POLICY "Allow all operations on customers" ON public.customers
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for contacts table  
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on contacts" ON public.contacts
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for activities table
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on activities" ON public.activities
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for deals table
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on deals" ON public.deals
  FOR ALL USING (true) WITH CHECK (true);

-- Add new columns to customers table for enhanced functionality
ALTER TABLE public.customers 
ADD COLUMN customer_type TEXT DEFAULT 'private' CHECK (customer_type IN ('private', 'business')),
ADD COLUMN lead_source TEXT DEFAULT 'web' CHECK (lead_source IN ('web', 'phone', 'referral')),
ADD COLUMN company_name TEXT,
ADD COLUMN notes TEXT;

-- Create a companies table for better organization
CREATE TABLE public.companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policy for companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on companies" ON public.companies
  FOR ALL USING (true) WITH CHECK (true);

-- Add company reference to contacts
ALTER TABLE public.contacts 
ADD COLUMN company_id BIGINT REFERENCES public.companies(id);

-- Create custom fields table for dynamic field structure
CREATE TABLE public.custom_fields (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('customer', 'contact', 'company')),
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'list', 'boolean')),
  field_options JSONB DEFAULT '{}',
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policy for custom fields
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on custom_fields" ON public.custom_fields
  FOR ALL USING (true) WITH CHECK (true);

-- Create custom field values table
CREATE TABLE public.custom_field_values (
  id BIGSERIAL PRIMARY KEY,
  field_id BIGINT REFERENCES public.custom_fields(id) ON DELETE CASCADE,
  entity_id BIGINT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('customer', 'contact', 'company')),
  field_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policy for custom field values
ALTER TABLE public.custom_field_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on custom_field_values" ON public.custom_field_values
  FOR ALL USING (true) WITH CHECK (true);
