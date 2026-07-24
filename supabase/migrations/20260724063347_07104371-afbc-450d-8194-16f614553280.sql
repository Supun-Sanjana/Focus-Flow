
-- Wipe orphan rows that predate ownership
DELETE FROM public.habit_logs;
DELETE FROM public.subtasks;
DELETE FROM public.tasks;
DELETE FROM public.habits;
DELETE FROM public.projects;

-- Add ownership columns
ALTER TABLE public.projects ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.tasks    ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.habits   ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS tasks_user_id_idx    ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS habits_user_id_idx   ON public.habits(user_id);

-- Drop old permissive policies
DROP POLICY IF EXISTS "public all projects"    ON public.projects;
DROP POLICY IF EXISTS "public all tasks"       ON public.tasks;
DROP POLICY IF EXISTS "public all subtasks"    ON public.subtasks;
DROP POLICY IF EXISTS "public all habits"      ON public.habits;
DROP POLICY IF EXISTS "public all habit_logs"  ON public.habit_logs;

-- Revoke anon access
REVOKE ALL ON public.projects   FROM anon;
REVOKE ALL ON public.tasks      FROM anon;
REVOKE ALL ON public.subtasks   FROM anon;
REVOKE ALL ON public.habits     FROM anon;
REVOKE ALL ON public.habit_logs FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subtasks   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habit_logs TO authenticated;

-- Owner-scoped policies
CREATE POLICY "own projects" ON public.projects FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own tasks" ON public.tasks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own habits" ON public.habits FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own subtasks" ON public.subtasks FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = subtasks.task_id AND t.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = subtasks.task_id AND t.user_id = auth.uid()));

CREATE POLICY "own habit_logs" ON public.habit_logs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_logs.habit_id AND h.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_logs.habit_id AND h.user_id = auth.uid()));
