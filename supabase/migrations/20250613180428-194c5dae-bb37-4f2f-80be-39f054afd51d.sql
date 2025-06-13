
-- Add board_type column to dynamic_boards table
ALTER TABLE public.dynamic_boards 
ADD COLUMN board_type TEXT DEFAULT 'custom';

-- Update existing records to have a default board_type
UPDATE public.dynamic_boards 
SET board_type = 'custom' 
WHERE board_type IS NULL;
