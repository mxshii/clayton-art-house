// Clayton Art House — Admin User Management & Account Service
// Supports Super Admin vs Admin permissions, role enforcement, and password/username settings.

import { AdminUserRecord, AdminRole, AdminStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';

export const adminService = {
  async getAdmins(): Promise<AdminUserRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data.map((r) => ({
          id: r.id,
          username: r.username || r.email.split('@')[0],
          email: r.email,
          role: r.role as AdminRole,
          status: (r.status as AdminStatus) || 'active',
          fullName: r.full_name,
          avatarUrl: r.avatar_url,
          lastSignInAt: r.last_sign_in_at,
          createdAt: r.created_at
        }));
      }
    }
    return localStore.getAdmins();
  },

  async createAdmin(data: {
    username: string;
    email: string;
    role: AdminRole;
    fullName?: string;
  }): Promise<AdminUserRecord> {
    if (isSupabaseConfigured() && supabase) {
      const { data: result, error } = await supabase.rpc('manage_admin_user_atomic', {
        p_action: 'create',
        p_username: data.username,
        p_email: data.email,
        p_role: data.role,
        p_status: 'active'
      });

      if (error) {
        throw new Error(error.message);
      }
    }
    return localStore.createAdmin(data);
  },

  async updateAdmin(
    id: string,
    updates: Partial<AdminUserRecord>
  ): Promise<AdminUserRecord> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.rpc('manage_admin_user_atomic', {
        p_action: 'update',
        p_id: id,
        p_username: updates.username || null,
        p_email: updates.email || null,
        p_role: updates.role || 'admin',
        p_status: updates.status || 'active'
      });

      if (error) {
        throw new Error(error.message);
      }
    }
    return localStore.updateAdmin(id, updates);
  },

  async deleteAdmin(id: string, callerId: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.rpc('manage_admin_user_atomic', {
        p_action: 'delete',
        p_id: id
      });

      if (error) {
        throw new Error(error.message);
      }
    }
    localStore.deleteAdmin(id, callerId);
  },

  async toggleAdminStatus(id: string, callerId: string): Promise<AdminUserRecord> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.rpc('manage_admin_user_atomic', {
        p_action: 'toggle_status',
        p_id: id
      });

      if (error) {
        throw new Error(error.message);
      }
    }
    return localStore.toggleAdminStatus(id, callerId);
  },

  // Account Settings: Change Password
  async changePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    return { success: true };
  },

  // Account Settings: Change Email
  async changeEmail(newEmail: string, currentAdminId: string): Promise<{ success: boolean; error?: string }> {
    if (!newEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) return { success: false, error: error.message };
    }

    try {
      localStore.updateAdmin(currentAdminId, { email: newEmail.toLowerCase().trim() });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Account Settings: Change Username
  async changeUsername(newUsername: string, currentAdminId: string): Promise<{ success: boolean; error?: string }> {
    const trimmed = newUsername.toLowerCase().trim();
    if (trimmed.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters.' };
    }

    try {
      localStore.updateAdmin(currentAdminId, { username: trimmed });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
};
