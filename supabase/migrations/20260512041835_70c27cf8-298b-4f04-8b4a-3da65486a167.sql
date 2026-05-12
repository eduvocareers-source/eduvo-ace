ALTER TABLE public.expo_registrations
  ALTER COLUMN course DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS stream text,
  ADD COLUMN IF NOT EXISTS guidance text,
  ADD COLUMN IF NOT EXISTS study_location text,
  ADD COLUMN IF NOT EXISTS parent_attending boolean;