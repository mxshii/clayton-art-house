-- Migration: Admin User Management, Roles (Super Admin vs Admin), and Permissions
-- Location: supabase/migrations/20261004000002_admin_roles_and_management.sql

-- 1. Upgrade admins table with username, status, role constraints, and audit columns
ALTER TABLE public.admins
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Ensure super_admin is an allowed role
ALTER TABLE public.admins DROP CONSTRAINT IF EXISTS admins_role_check;
ALTER TABLE public.admins ADD CONSTRAINT admins_role_check CHECK (role IN ('super_admin', 'admin'));

-- Ensure username uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_username ON public.admins(lower(username));

-- Seed default Super Admin
INSERT INTO public.admins (id, username, email, role, status, full_name)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'superadmin',
  'admin@claytonarthouse.com',
  'super_admin',
  'active',
  'Clayton Lead Curator'
)
ON CONFLICT (email) DO UPDATE
SET
  role = 'super_admin',
  username = COALESCE(public.admins.username, 'superadmin'),
  status = 'active';

-- Seed secondary atelier manager
INSERT INTO public.admins (id, username, email, role, status, full_name)
VALUES (
  '22222222-2222-2222-2222-222222222223',
  'nour.ceramics',
  'nour@claytonarthouse.com',
  'admin',
  'active',
  'Nour El-Din (Studio Manager)'
)
ON CONFLICT (email) DO NOTHING;

-- 2. Enhanced Authorization Helper Functions
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE (email = auth.jwt() ->> 'email' OR id = auth.uid())
      AND role = 'super_admin'
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Super Admin Protected RPC to Manage Admins
CREATE OR REPLACE FUNCTION public.manage_admin_user_atomic(
  p_action TEXT, -- 'create', 'update', 'delete', 'toggle_status'
  p_id UUID DEFAULT NULL,
  p_username TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'admin',
  p_status TEXT DEFAULT 'active'
)
RETURNS JSONB AS $$
DECLARE
  v_current_is_super BOOLEAN;
  v_target_admin RECORD;
  v_super_count INTEGER;
  v_new_id UUID;
BEGIN
  -- Verify caller is super_admin
  v_current_is_super := public.is_super_admin();
  IF NOT v_current_is_super THEN
    RAISE EXCEPTION 'Unauthorized: Only Super Admins can manage administrative credentials.';
  END IF;

  -- ACTION: CREATE
  IF p_action = 'create' THEN
    IF p_username IS NULL OR length(trim(p_username)) < 3 THEN
      RAISE EXCEPTION 'Username must be at least 3 characters.';
    END IF;

    IF p_email IS NULL OR position('@' in p_email) = 0 THEN
      RAISE EXCEPTION 'Valid email address is required.';
    END IF;

    INSERT INTO public.admins (username, email, role, status)
    VALUES (lower(trim(p_username)), lower(trim(p_email)), p_role, p_status)
    RETURNING id INTO v_new_id;

    RETURN jsonb_build_object('success', true, 'id', v_new_id, 'message', 'Admin created successfully.');

  -- ACTION: UPDATE
  ELSIF p_action = 'update' THEN
    SELECT * INTO v_target_admin FROM public.admins WHERE id = p_id FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Admin user not found.';
    END IF;

    -- Safety check: ensure at least one active super_admin remains
    IF v_target_admin.role = 'super_admin' AND p_role != 'super_admin' THEN
      SELECT count(*) INTO v_super_count FROM public.admins WHERE role = 'super_admin' AND status = 'active' AND id != p_id;
      IF v_super_count < 1 THEN
        RAISE EXCEPTION 'Cannot demote the last remaining Super Admin.';
      END IF;
    END IF;

    UPDATE public.admins
    SET
      username = COALESCE(lower(trim(p_username)), username),
      email = COALESCE(lower(trim(p_email)), email),
      role = p_role,
      status = p_status,
      updated_at = now()
    WHERE id = p_id;

    RETURN jsonb_build_object('success', true, 'message', 'Admin updated successfully.');

  -- ACTION: DELETE
  ELSIF p_action = 'delete' THEN
    SELECT * INTO v_target_admin FROM public.admins WHERE id = p_id FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Admin user not found.';
    END IF;

    -- Check caller is not deleting themselves
    IF v_target_admin.email = auth.jwt() ->> 'email' THEN
      RAISE EXCEPTION 'You cannot delete your own administrative account.';
    END IF;

    IF v_target_admin.role = 'super_admin' THEN
      SELECT count(*) INTO v_super_count FROM public.admins WHERE role = 'super_admin' AND status = 'active' AND id != p_id;
      IF v_super_count < 1 THEN
        RAISE EXCEPTION 'Cannot delete the last remaining Super Admin.';
      END IF;
    END IF;

    DELETE FROM public.admins WHERE id = p_id;
    RETURN jsonb_build_object('success', true, 'message', 'Admin deleted successfully.');

  -- ACTION: TOGGLE STATUS
  ELSIF p_action = 'toggle_status' THEN
    SELECT * INTO v_target_admin FROM public.admins WHERE id = p_id FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Admin user not found.';
    END IF;

    IF v_target_admin.email = auth.jwt() ->> 'email' THEN
      RAISE EXCEPTION 'You cannot disable your own administrative account.';
    END IF;

    UPDATE public.admins
    SET
      status = CASE WHEN status = 'active' THEN 'disabled' ELSE 'active' END,
      updated_at = now()
    WHERE id = p_id;

    RETURN jsonb_build_object('success', true, 'message', 'Status toggled successfully.');
  ELSE
    RAISE EXCEPTION 'Unknown action: %', p_action;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
