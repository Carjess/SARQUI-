-- 1) Create roles enum and user_roles table if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
      ON public.user_roles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END$$;

-- 2) Security definer function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _role
  );
$$;

-- 3) Create empresas table
CREATE TABLE IF NOT EXISTS public.empresas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  logo text,
  descripcion text,
  contacto jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Public can view empresas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'empresas' AND policyname = 'Empresas are viewable by everyone'
  ) THEN
    CREATE POLICY "Empresas are viewable by everyone"
      ON public.empresas
      FOR SELECT
      USING (true);
  END IF;
END$$;

-- Admins can manage empresas (insert/update/delete)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'empresas' AND policyname = 'Admins can manage empresas'
  ) THEN
    CREATE POLICY "Admins can manage empresas"
      ON public.empresas
      FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- 4) Align destinations schema with app expectations
-- Add columns if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'destinations' AND column_name = 'categoria'
  ) THEN
    ALTER TABLE public.destinations ADD COLUMN categoria text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'destinations' AND column_name = 'estado'
  ) THEN
    ALTER TABLE public.destinations ADD COLUMN estado text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'destinations' AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE public.destinations ADD COLUMN empresa_id uuid;
  END IF;
END$$;

-- Set defaults
ALTER TABLE public.destinations ALTER COLUMN categoria SET DEFAULT 'otro';
ALTER TABLE public.destinations ALTER COLUMN estado SET DEFAULT 'activo';

-- Backfill existing rows
UPDATE public.destinations SET categoria = 'otro' WHERE categoria IS NULL;
UPDATE public.destinations SET estado = 'activo' WHERE estado IS NULL;

-- Enforce not null after backfill
ALTER TABLE public.destinations ALTER COLUMN categoria SET NOT NULL;
ALTER TABLE public.destinations ALTER COLUMN estado SET NOT NULL;

-- Add estado constraint if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'destinations_estado_valid' AND conrelid = 'public.destinations'::regclass
  ) THEN
    ALTER TABLE public.destinations
      ADD CONSTRAINT destinations_estado_valid CHECK (estado IN ('activo','inactivo'));
  END IF;
END$$;

-- Add FK to empresas (ignore if it already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'destinations_empresa_fk' AND conrelid = 'public.destinations'::regclass
  ) THEN
    ALTER TABLE public.destinations
      ADD CONSTRAINT destinations_empresa_fk FOREIGN KEY (empresa_id)
      REFERENCES public.empresas(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_destinations_estado ON public.destinations (estado);
CREATE INDEX IF NOT EXISTS idx_destinations_categoria ON public.destinations (categoria);
