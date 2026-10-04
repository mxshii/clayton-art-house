import React, { useState, useEffect } from 'react';
import { authService, AdminUser } from '../../services/authService';
import { adminService } from '../../services/adminService';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminAccountSettings: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status notifications
  const [usernameStatus, setUsernameStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [savingUsername, setSavingUsername] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const user = await authService.getSession();
        if (user) {
          setCurrentUser(user);
          setUsername(user.username || user.email.split('@')[0]);
          setEmail(user.email);
        }
      } catch (err) {
        console.error('Failed to load admin session:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  // Update Username
  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setUsernameStatus(null);

    const trimmed = username.toLowerCase().trim();
    if (trimmed.length < 3) {
      setUsernameStatus({ type: 'error', message: 'Username must be at least 3 characters.' });
      return;
    }

    try {
      setSavingUsername(true);
      const res = await adminService.changeUsername(trimmed, currentUser.id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to update username.');
      }
      setUsernameStatus({ type: 'success', message: 'Username successfully updated.' });
    } catch (err: any) {
      setUsernameStatus({ type: 'error', message: err.message || 'Username already in use.' });
    } finally {
      setSavingUsername(false);
    }
  };

  // Update Email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setEmailStatus(null);

    const trimmed = email.toLowerCase().trim();
    if (!trimmed.includes('@')) {
      setEmailStatus({ type: 'error', message: 'Please provide a valid email address.' });
      return;
    }

    try {
      setSavingEmail(true);
      const res = await adminService.changeEmail(trimmed, currentUser.id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to change login email.');
      }
      setEmailStatus({
        type: 'success',
        message: 'Login email updated. If using Supabase Auth, check your inbox for confirmation.'
      });
    } catch (err: any) {
      setEmailStatus({ type: 'error', message: err.message || 'Failed to update email.' });
    } finally {
      setSavingEmail(false);
    }
  };

  // Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    try {
      setSavingPassword(true);
      const res = await adminService.changePassword(newPassword);
      if (!res.success) {
        throw new Error(res.error || 'Failed to update password.');
      }
      setPasswordStatus({ type: 'success', message: 'Password successfully changed.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message || 'Failed to change password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-3 border-clayton-green border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-clayton-border flex items-center justify-between">
        <div>
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-clayton-green hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Settings Directory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
            Admin Account & Security
          </h1>
          <p className="text-xs sm:text-sm text-clayton-charcoal-muted mt-0.5">
            Manage your personal login credentials, display username, and authentication password.
          </p>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-full bg-clayton-linen border border-clayton-border text-clayton-charcoal">
            {currentUser?.isSuperAdmin ? 'Super Admin Account' : 'Studio Admin Account'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Username & Profile Card */}
        <div className="bg-white border border-clayton-border p-6 rounded-2xl shadow-warm-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-clayton-border/60">
            <div className="w-9 h-9 rounded-full bg-clayton-green/10 text-clayton-green flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg text-clayton-charcoal font-semibold">Change Username</h2>
              <p className="text-xs text-clayton-charcoal-muted">Unique handle for login and staff notes</p>
            </div>
          </div>

          {usernameStatus && (
            <div
              className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                usernameStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {usernameStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{usernameStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleUpdateUsername} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-clayton text-xs font-mono"
              />
              <span className="text-[10px] text-clayton-charcoal-muted mt-1 block">
                Letters, numbers, and periods only. Minimum 3 characters.
              </span>
            </div>

            <button
              type="submit"
              disabled={savingUsername}
              className="btn-primary text-xs !py-2 !px-4 disabled:opacity-50"
            >
              {savingUsername ? 'Updating...' : 'Save Username'}
            </button>
          </form>
        </div>

        {/* Login Email Card */}
        <div className="bg-white border border-clayton-border p-6 rounded-2xl shadow-warm-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-clayton-border/60">
            <div className="w-9 h-9 rounded-full bg-clayton-olive/10 text-clayton-olive flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg text-clayton-charcoal font-semibold">Change Login Email</h2>
              <p className="text-xs text-clayton-charcoal-muted">Authentication & recovery address</p>
            </div>
          </div>

          {emailStatus && (
            <div
              className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                emailStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {emailStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{emailStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleUpdateEmail} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-clayton text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={savingEmail}
              className="btn-primary text-xs !py-2 !px-4 disabled:opacity-50"
            >
              {savingEmail ? 'Updating...' : 'Update Login Email'}
            </button>
          </form>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white border border-clayton-border p-6 sm:p-8 rounded-2xl shadow-warm-sm space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-clayton-border/60">
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg text-clayton-charcoal font-semibold">Change Password</h2>
            <p className="text-xs text-clayton-charcoal-muted">Enforce strong encryption for staff access</p>
          </div>
        </div>

        {passwordStatus && (
          <div
            className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
              passwordStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {passwordStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{passwordStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs max-w-lg">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
              New Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="input-clayton text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="input-clayton text-xs font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="btn-primary text-xs !py-2.5 !px-5 disabled:opacity-50"
            >
              {savingPassword ? 'Changing Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
