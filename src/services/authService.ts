// Clayton Art House — Admin Authentication Service
// Built on Supabase Auth with persistent session verification, username resolution, and role tracking.

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';
import { AdminRole, AdminStatus } from '../types';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  token?: string;
  isSuperAdmin?: boolean;
}

const LOCAL_ADMIN_KEY = 'clayton_admin_session';

export const authService = {
  async getSession(): Promise<AdminUser | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Query admin role & username from admins table
        const { data: adminRecord } = await supabase
          .from('admins')
          .select('*')
          .eq('email', session.user.email)
          .single();

        const role = (adminRecord?.role as AdminRole) || 'admin';
        return {
          id: session.user.id,
          username: adminRecord?.username || session.user.email?.split('@')[0] || 'admin',
          email: session.user.email || '',
          role,
          status: (adminRecord?.status as AdminStatus) || 'active',
          token: session.access_token,
          isSuperAdmin: role === 'super_admin'
        };
      }
      return null;
    }

    // Local dev session
    try {
      const stored = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (stored) {
        const u = JSON.parse(stored);
        return {
          ...u,
          isSuperAdmin: u.role === 'super_admin'
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  async login(loginIdentifier: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const trimmedInput = loginIdentifier.trim().toLowerCase();

    if (isSupabaseConfigured() && supabase) {
      let targetEmail = trimmedInput;

      // If user typed a username without @, resolve email from admins table
      if (!trimmedInput.includes('@')) {
        const { data: matchedAdmin } = await supabase
          .from('admins')
          .select('email, status')
          .eq('username', trimmedInput)
          .single();

        if (!matchedAdmin) {
          return { success: false, error: 'No admin account found matching this username.' };
        }
        if (matchedAdmin.status === 'disabled') {
          return { success: false, error: 'This admin account has been disabled. Please contact the Super Admin.' };
        }
        targetEmail = matchedAdmin.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid administrative credentials.' };
      }

      // Fetch admin role
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('email', targetEmail)
        .single();

      if (adminData?.status === 'disabled') {
        await supabase.auth.signOut();
        return { success: false, error: 'This admin account has been disabled.' };
      }

      const role = (adminData?.role as AdminRole) || 'admin';
      const adminUser: AdminUser = {
        id: data.user.id,
        username: adminData?.username || targetEmail.split('@')[0],
        email: targetEmail,
        role,
        status: (adminData?.status as AdminStatus) || 'active',
        token: data.session?.access_token,
        isSuperAdmin: role === 'super_admin'
      };

      // Record sign in time
      await supabase
        .from('admins')
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq('id', adminData?.id || data.user.id);

      return { success: true, user: adminUser };
    }

    // Local developer credentials check
    const localAdmins = localStore.getAdmins();
    const matched = localAdmins.find(
      (a) => a.email.toLowerCase() === trimmedInput || a.username.toLowerCase() === trimmedInput
    );

    if (matched) {
      if (matched.status === 'disabled') {
        return { success: false, error: 'This administrative account is currently disabled.' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      const user: AdminUser = {
        id: matched.id,
        username: matched.username,
        email: matched.email,
        role: matched.role,
        status: matched.status,
        token: 'cly-mock-token-' + Date.now(),
        isSuperAdmin: matched.role === 'super_admin'
      };

      localStore.updateAdmin(matched.id, { lastSignInAt: new Date().toISOString() });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(user));
      }
      return { success: true, user };
    }

    // Quick admin fallback for standard login
    if (trimmedInput === 'admin@claytonarthouse.com' || trimmedInput === 'admin' || trimmedInput === 'superadmin') {
      const user: AdminUser = {
        id: '22222222-2222-2222-2222-222222222222',
        username: 'superadmin',
        email: 'admin@claytonarthouse.com',
        role: 'super_admin',
        status: 'active',
        token: 'cly-mock-token-' + Date.now(),
        isSuperAdmin: true
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(user));
      }
      return { success: true, user };
    }

    return {
      success: false,
      error: 'Unrecognized admin account. Available demo: admin@claytonarthouse.com or username "superadmin".'
    };
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LOCAL_ADMIN_KEY);
    }
  },

  isAuthenticated(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem(LOCAL_ADMIN_KEY) !== null;
  }
};
