import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { authService, AdminUser } from '../../services/authService';
import {
  LayoutDashboard,
  CalendarDays,
  Palette,
  Clock,
  Users,
  MessageSquare,
  Image,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  KeyRound
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const user = await authService.getSession();
      if (!user) {
        navigate('/admin/login', { replace: true });
      } else {
        setCurrentUser(user);
      }
      setCheckingAuth(false);
    };
    verify();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F6F4F0] flex items-center justify-center font-montserrat">
        <div className="w-8 h-8 border-3 border-[#577057] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { label: 'Workshops', path: '/admin/workshops', icon: Palette },
    { label: 'Sessions', path: '/admin/sessions', icon: Clock },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Private Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { label: 'Gallery', path: '/admin/gallery', icon: Image },
    { label: 'Admin Access', path: '/admin/admins', icon: ShieldCheck },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isCurrentActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col md:flex-row text-stone-900 font-montserrat">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/clayton/logo/Clayton Art House Logo.png"
            alt="Clayton Art House"
            className="h-7 w-auto object-contain"
          />
          <span className="font-bold text-sm text-stone-900">Admin Portal</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg"
          aria-label="Toggle Menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-200 ease-in-out fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-stone-200 flex flex-col justify-between shrink-0 z-50`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <Link to="/admin" className="flex items-center gap-2.5">
              <img
                src="/assets/clayton/logo/Clayton Art House Logo.png"
                alt="Clayton Art House"
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="font-bold text-sm text-stone-900 block leading-tight">
                  Clayton
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#577057] font-bold">
                  Studio Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    active
                      ? 'bg-[#577057] text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: User Profile, Role Badge & Account Settings */}
        <div className="p-4 border-t border-stone-200 space-y-3 bg-stone-50/70">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-stone-600 hover:text-[#577057] transition-colors rounded-lg hover:bg-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#577057]" />
              <span>View Public Site</span>
            </span>
          </Link>

          <div className="pt-2 border-t border-stone-200/60">
            <div className="flex items-center justify-between mb-2">
              <div className="truncate pr-2">
                <span className="block text-xs font-bold text-stone-900 truncate">
                  {currentUser?.username || currentUser?.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-stone-500 truncate block">
                  {currentUser?.email}
                </span>
              </div>
              <span
                className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold shrink-0 ${
                  currentUser?.isSuperAdmin
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {currentUser?.isSuperAdmin ? 'Super Admin' : 'Manager'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-200/50">
              <Link
                to="/admin/settings/account"
                className="text-[11px] font-semibold text-[#577057] hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>My Account</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 transition-colors flex items-center gap-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};
