import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, X, Compass, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState('superadmin');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryDispatched, setRecoveryDispatched] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(identifier, password);
      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(res.error || 'Invalid credentials or inactive account.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: 'super' | 'admin') => {
    if (role === 'super') {
      setIdentifier('superadmin');
      setPassword('password123');
    } else {
      setIdentifier('nour.ceramics');
      setPassword('password123');
    }
    setError(null);
  };

  const handleDispatchRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setTimeout(() => {
      setRecoveryLoading(false);
      setRecoveryDispatched(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-clayton-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center justify-center mx-auto mb-1">
          <img
            src="/assets/clayton/logo/Clayton Art House Logo.png"
            alt="Clayton Art House"
            className="h-16 sm:h-20 w-auto object-contain"
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl text-clayton-charcoal tracking-tight font-bold">
          Clayton Admin Portal
        </h1>
        <p className="text-xs uppercase tracking-wider text-clayton-green font-semibold">
          Staff & Venue Administration • Kafr Abdo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 border border-clayton-border shadow-warm-md space-y-6 rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-clayton-charcoal/70 mb-1.5 font-medium">
                Username or Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-clayton-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input-clayton !pl-10 text-xs"
                  placeholder="superadmin or admin@claytonarthouse.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-clayton-charcoal/70 font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-clayton-green hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-clayton-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-clayton !pl-10 text-xs"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-clayton-charcoal/75">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-clayton-border text-clayton-green focus:ring-0"
                />
                <span>Remember this computer</span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-clayton-green w-full justify-center text-xs gap-2 disabled:opacity-50 py-3 font-semibold"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Credentials */}
          <div className="pt-4 border-t border-clayton-border space-y-2">
            <span className="font-mono text-[10px] uppercase text-clayton-charcoal-muted block text-center">
              Quick Role Authentication (Development / QA)
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('super')}
                className="py-1.5 px-2 border border-clayton-border rounded-lg hover:border-clayton-green hover:bg-[#EFF3EE] text-clayton-charcoal text-center transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="py-1.5 px-2 border border-clayton-border rounded-lg hover:border-clayton-green hover:bg-[#EFF3EE] text-clayton-charcoal text-center transition-colors"
              >
                Studio Manager
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="font-mono text-xs text-clayton-green hover:underline inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Art House Website</span>
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-clayton-border shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-clayton-border">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-clayton-green" />
                <h3 className="font-bold text-lg text-clayton-charcoal">Reset Password</h3>
              </div>
              <button onClick={() => setIsForgotModalOpen(false)}>
                <X className="w-4 h-4 text-clayton-umber/60" />
              </button>
            </div>

            {recoveryDispatched ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-8 h-8 text-clayton-patina mx-auto" />
                <p className="font-sans text-xs text-clayton-umber/80 leading-relaxed">
                  Recovery instructions dispatched. If this email matches an active administrator account, you will receive a secure token shortly.
                </p>
                <button
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setRecoveryDispatched(false);
                  }}
                  className="btn-editorial-primary text-xs w-full justify-center"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleDispatchRecovery} className="space-y-4 text-xs">
                <p className="font-sans text-clayton-umber/75 leading-relaxed">
                  Enter your staff email address to receive password recovery instructions.
                </p>
                <div>
                  <label className="block font-mono uppercase tracking-wider text-clayton-umber/70 mb-1">
                    Staff Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@claytonarthouse.com"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="input-clayton text-xs font-mono"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="btn-editorial-secondary text-xs !py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="btn-editorial-primary text-xs !py-2 disabled:opacity-50"
                  >
                    {recoveryLoading ? 'Dispatching...' : 'Send Recovery'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
