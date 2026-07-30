CREATE TABLE public.schedule_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  day_of_week SMALLINT NOT NULL,
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME,
  title TEXT NOT NULL,
  details TEXT,
  color TEXT NOT NULL DEFAULT '#7C3AED',
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedule_blocks TO authenticated;
GRANT ALL ON public.schedule_blocks TO service_role;
ALTER TABLE public.schedule_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own schedule blocks" ON public.schedule_blocks
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.schedule_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  text TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'non_negotiable',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedule_rules TO authenticated;
GRANT ALL ON public.schedule_rules TO service_role;
ALTER TABLE public.schedule_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own schedule rules" ON public.schedule_rules
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_schedule_blocks_updated_at BEFORE UPDATE ON public.schedule_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_schedule_rules_updated_at BEFORE UPDATE ON public.schedule_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
