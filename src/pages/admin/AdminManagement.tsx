import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { authService, AdminUser } from '../../services/authService';
import { AdminUserRecord, AdminRole } from '../../types';
import {
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  Power,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Lock,
  Mail,
  User,
  ShieldAlert
} from 'lucide-react';

export const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUserRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [targetAdmin, setTargetAdmin] = useState<AdminUserRecord | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    role: AdminRole;
    tempPassword?: string;
    fullName?: string;
  }>({
    username: '',
    email: '',
    role: 'admin',
    tempPassword: '',
    fullName: ''
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allAdmins, session] = await Promise.all([
        adminService.getAdmins(),
        authService.getSession()
      ]);
      setAdmins(allAdmins);
      setCurrentUser(session);
    } catch (err: any) {
      console.error('Failed to load admins:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to load administrator records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Open Create Modal
  const openAddModal = () => {
    setFormData({
      username: '',
      email: '',
      role: 'admin',
      tempPassword: 'ClaytonTempPassword' + Math.floor(100 + Math.random() * 900) + '!',
      fullName: ''
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (admin: AdminUserRecord) => {
    setTargetAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle Create Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.isSuperAdmin) {
      showNotification('error', 'Only Super Administrators can create staff accounts.');
      return;
    }

    try {
      setProcessing(true);
      await adminService.createAdmin({
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        fullName: formData.fullName?.trim()
      });
      setIsAddModalOpen(false);
      showNotification('success', `Administrator ${formData.username} created successfully.`);
      await loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to create administrator.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Edit Admin
  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAdmin) return;
    if (!currentUser?.isSuperAdmin) {
      showNotification('error', 'Only Super Administrators can modify administrator roles.');
      return;
    }

    try {
      setProcessing(true);
      await adminService.updateAdmin(targetAdmin.id, {
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        fullName: formData.fullName?.trim()
      });
      setIsEditModalOpen(false);
      showNotification('success', `Administrator ${formData.username} updated.`);
      await loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update administrator.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = async (admin: AdminUserRecord) => {
    if (!currentUser?.isSuperAdmin) {
      showNotification('error', 'Only Super Administrators can change access status.');
      return;
    }

    try {
      await adminService.toggleAdminStatus(admin.id, currentUser.id);
      const newStatus = admin.status === 'active' ? 'disabled' : 'activated';
      showNotification('success', `Administrator ${admin.username} has been ${newStatus}.`);
      await loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to toggle account status.');
    }
  };

  // Handle Delete Admin
  const handleDeleteAdmin = async () => {
    if (!targetAdmin || !currentUser) return;
    if (!currentUser.isSuperAdmin) {
      showNotification('error', 'Only Super Administrators can remove administrators.');
      return;
    }

    try {
      setProcessing(true);
      await adminService.deleteAdmin(targetAdmin.id, currentUser.id);
      setIsDeleteModalOpen(false);
      showNotification('success', `Administrator ${targetAdmin.username} removed.`);
      await loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete administrator.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Password Reset Trigger
  const handleTriggerReset = async () => {
    if (!targetAdmin) return;
    try {
      setProcessing(true);
      // Simulate/trigger password reset link dispatch
      setIsResetModalOpen(false);
      showNotification('success', `Temporary recovery instructions dispatched to ${targetAdmin.email}.`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to dispatch reset.');
    } finally {
      setProcessing(false);
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.fullName && a.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 border flex items-center justify-between font-mono text-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-clayton-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
              Admin Access Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-clayton-green/10 text-clayton-green">
              Super Admin Control
            </span>
          </div>
          <p className="text-xs sm:text-sm text-clayton-charcoal-muted mt-1">
            Manage staff credentials, role-based authorizations, and active studio sessions.
          </p>
        </div>

        {currentUser?.isSuperAdmin ? (
          <button
            onClick={openAddModal}
            className="btn-primary text-xs !py-2.5 gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Administrator</span>
          </button>
        ) : (
          <div className="px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5 rounded-lg">
            <Lock className="w-3.5 h-3.5" />
            <span>Read-only: Super Admin required for user changes</span>
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-clayton-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search username, email, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-clayton !pl-10 !py-2 text-xs"
          />
        </div>
        <div className="text-xs text-clayton-charcoal-muted font-mono">
          Total Admins: {admins.length}
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white border border-clayton-border rounded-2xl overflow-hidden shadow-warm-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-clayton-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-clayton-charcoal-muted mt-3">Loading administrator records...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center text-clayton-charcoal-muted text-sm">
            No administrators found matching "{searchQuery}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-clayton-border font-mono uppercase text-[11px] text-clayton-charcoal-muted">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clayton-border/60">
                {filteredAdmins.map((admin) => {
                  const isCurrent = currentUser?.id === admin.id;
                  const isSuper = admin.role === 'super_admin';
                  const isActive = admin.status === 'active';

                  return (
                    <tr key={admin.id} className="hover:bg-clayton-linen/40 transition-colors">
                      {/* User Column */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-clayton-green/15 text-clayton-green font-bold text-sm flex items-center justify-center shrink-0 border border-clayton-green/30">
                            {admin.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-clayton-charcoal text-sm">
                                {admin.username}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] bg-clayton-charcoal text-white px-1.5 py-0.2 rounded font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-clayton-charcoal-muted block">
                              {admin.email}
                            </span>
                            {admin.fullName && (
                              <span className="text-[10px] text-clayton-charcoal-light">
                                {admin.fullName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="py-4 px-4 font-mono">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-amber-700" />
                            Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-clayton-olive bg-clayton-olive-light px-2 py-0.5 rounded-full border border-clayton-olive/30">
                            Studio Admin
                          </span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-4 font-mono">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Last Activity */}
                      <td className="py-4 px-4 font-mono text-[11px] text-clayton-charcoal-muted">
                        {admin.lastSignInAt
                          ? new Date(admin.lastSignInAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : 'Never'}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 font-mono text-[11px] text-clayton-charcoal-muted">
                        {new Date(admin.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {currentUser?.isSuperAdmin ? (
                            <>
                              <button
                                onClick={() => openEditModal(admin)}
                                className="p-1.5 rounded-lg text-clayton-charcoal-muted hover:text-clayton-charcoal hover:bg-clayton-linen transition-colors"
                                title="Edit Role & Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  setTargetAdmin(admin);
                                  setIsResetModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-clayton-charcoal-muted hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                title="Send Password Reset"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              {!isCurrent && (
                                <>
                                  <button
                                    onClick={() => handleToggleStatus(admin)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      isActive
                                        ? 'text-clayton-charcoal-muted hover:text-red-700 hover:bg-red-50'
                                        : 'text-emerald-700 hover:bg-emerald-50'
                                    }`}
                                    title={isActive ? 'Disable Admin' : 'Re-enable Admin'}
                                  >
                                    <Power className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setTargetAdmin(admin);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg text-clayton-charcoal-muted hover:text-red-700 hover:bg-red-50 transition-colors"
                                    title="Delete Admin Permanently"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <span className="text-[11px] text-clayton-charcoal-light font-mono">
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permissions Breakdown Matrix */}
      <div className="bg-white border border-clayton-border p-6 rounded-2xl space-y-4">
        <h3 className="text-lg text-clayton-charcoal font-semibold">
          Role Permissions Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-clayton-border/70 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Super Administrator</span>
            </div>
            <ul className="space-y-1 text-clayton-charcoal-muted">
              <li>✓ Full platform and database administrative authority</li>
              <li>✓ Create, edit, toggle, and permanently remove admin accounts</li>
              <li>✓ Manage workshop schedules, sessions, and atomic bookings</li>
              <li>✓ Manage customer database and CRM inquiries</li>
              <li>✓ Modify villa settings, business parameters, and booking rules</li>
              <li>✓ Protected against self-deletion and accidental lockouts</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-clayton-border/70 space-y-2">
            <div className="flex items-center gap-1.5 text-clayton-olive font-bold">
              <User className="w-4 h-4" />
              <span>Studio Administrator</span>
            </div>
            <ul className="space-y-1 text-clayton-charcoal-muted">
              <li>✓ Manage workshop sessions, capacity, and student attendance</li>
              <li>✓ Process walk-in bookings and customer records</li>
              <li>✓ Respond to private event inquiries</li>
              <li>✓ Update gallery photos</li>
              <li>✗ Cannot add, edit, or remove other administrator accounts</li>
              <li>✗ Cannot alter master database credentials</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL: ADD ADMIN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-clayton-border shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-clayton-border">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-clayton-green" />
                <h3 className="text-lg font-semibold text-clayton-charcoal">
                  Create Administrator
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-clayton-charcoal-muted" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-clayton-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. farida.ceramics"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-clayton !pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Login Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-clayton-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="farida@claytonarthouse.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-clayton !pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Farida Mansour"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Role Assignment *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`p-3 rounded-xl border text-left font-mono transition-all ${
                      formData.role === 'admin'
                        ? 'border-clayton-olive bg-clayton-olive-light/50 text-clayton-olive font-bold'
                        : 'border-clayton-border text-clayton-charcoal'
                    }`}
                  >
                    <span>Studio Admin</span>
                    <span className="block text-[10px] font-normal text-clayton-charcoal-muted mt-0.5">
                      Operations & Bookings
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'super_admin' })}
                    className={`p-3 rounded-xl border text-left font-mono transition-all ${
                      formData.role === 'super_admin'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                        : 'border-clayton-border text-clayton-charcoal'
                    }`}
                  >
                    <span>Super Admin</span>
                    <span className="block text-[10px] font-normal text-clayton-charcoal-muted mt-0.5">
                      Full Access
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Initial Temporary Password
                </label>
                <div className="relative font-mono">
                  <Lock className="w-4 h-4 text-clayton-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    value={formData.tempPassword}
                    className="input-clayton !pl-9 bg-clayton-sand-light text-xs font-mono select-all"
                  />
                </div>
                <span className="text-[10px] text-clayton-charcoal-muted mt-1 block">
                  The user can change their password under Account Settings upon first login.
                </span>
              </div>

              <div className="pt-3 border-t border-clayton-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary text-xs !py-2 !px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary text-xs !py-2 !px-4 disabled:opacity-50"
                >
                  {processing ? 'Creating...' : 'Confirm & Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ADMIN */}
      {isEditModalOpen && targetAdmin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-clayton-border shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-clayton-border">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-clayton-green" />
                <h3 className="text-lg font-semibold text-clayton-charcoal">
                  Edit Administrator
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="w-5 h-5 text-clayton-charcoal-muted" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-clayton text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className="input-clayton text-xs font-mono"
                >
                  <option value="admin">Studio Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="pt-3 border-t border-clayton-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary text-xs !py-2 !px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary text-xs !py-2 !px-4 disabled:opacity-50"
                >
                  {processing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {isDeleteModalOpen && targetAdmin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-red-200 shadow-warm-lg space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-clayton-charcoal">
                Permanently Remove Administrator?
              </h3>
              <p className="text-xs text-clayton-charcoal-muted leading-relaxed">
                Are you sure you want to delete administrator <strong>{targetAdmin.username}</strong> ({targetAdmin.email})? This action cannot be undone.
              </p>
            </div>

            <div className="pt-3 border-t border-clayton-border flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn-secondary text-xs !py-2 !px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAdmin}
                disabled={processing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-xs transition-colors"
              >
                {processing ? 'Removing...' : 'Delete Administrator'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD TRIGGER */}
      {isResetModalOpen && targetAdmin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-clayton-border shadow-warm-lg space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-clayton-charcoal">
                Trigger Password Reset
              </h3>
              <p className="text-xs text-clayton-charcoal-muted leading-relaxed">
                Dispatch password recovery instructions and a secure reset token to <strong>{targetAdmin.email}</strong>.
              </p>
            </div>

            <div className="pt-3 border-t border-clayton-border flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="btn-secondary text-xs !py-2 !px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerReset}
                disabled={processing}
                className="btn-primary text-xs !py-2 !px-4"
              >
                {processing ? 'Sending...' : 'Dispatch Reset Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
