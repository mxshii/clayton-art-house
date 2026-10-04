import React, { useEffect, useState } from 'react';
import { SiteSettings } from '../../types';
import { settingsService } from '../../services/settingsService';
import { localStore } from '../../lib/localStore';
import { Link } from 'react-router-dom';
import {
  Save,
  CheckCircle2,
  RotateCcw,
  Building,
  Bell,
  Users,
  KeyRound,
  Sliders
} from 'lucide-react';

type SettingsTab = 'business' | 'booking' | 'notifications' | 'access' | 'account';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('business');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Business Tab Fields
  const [venueName, setVenueName] = useState('');
  const [tagline, setTagline] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [openingHours, setOpeningHours] = useState('');

  // Booking Tab Fields
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [defaultCapacity, setDefaultCapacity] = useState('10');
  const [autoApproveBookings, setAutoApproveBookings] = useState(true);
  const [allowCashOnArrival, setAllowCashOnArrival] = useState(true);

  // Notifications Tab Fields
  const [notifyStaffOnBooking, setNotifyStaffOnBooking] = useState(true);
  const [notifyCustomerConfirmation, setNotifyCustomerConfirmation] = useState(true);
  const [staffNotificationEmail, setStaffNotificationEmail] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const s = await settingsService.getSettings();
      setSettings(s);
      setVenueName(s.venueName);
      setTagline(s.tagline);
      setAddress(s.addressLine1);
      setCity(s.city);
      setPhone(s.phone);
      setEmail(s.email);
      setInstagram(s.instagram);
      setOpeningHours(s.openingHours);
      setCancellationPolicy(s.cancellationPolicy);
      setStaffNotificationEmail(s.email || 'admin@claytonarthouse.com');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await settingsService.updateSettings({
        venueName,
        tagline,
        addressLine1: address,
        city,
        phone,
        email,
        instagram,
        openingHours,
        cancellationPolicy
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetSeed = () => {
    if (
      window.confirm(
        'Reset local database to initial Clayton Art House Alexandria seed data? This will restore sample bookings, workshops, and sessions.'
      )
    ) {
      localStore.resetToSeed();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-clayton-charcoal-muted">
        <div className="w-8 h-8 border-3 border-clayton-green border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading studio settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-clayton-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
            Platform & Venue Settings
          </h1>
          <p className="text-xs text-clayton-charcoal-muted mt-1">
            Configure Kafr Abdo villa identity, booking parameters, admin permissions, and notification channels.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-1 border-b border-clayton-border overflow-x-auto pb-1 font-mono text-xs">
        <button
          onClick={() => setActiveTab('business')}
          className={`px-4 py-2.5 border-b-2 font-medium transition-all ${
            activeTab === 'business'
              ? 'border-clayton-green text-clayton-charcoal font-bold'
              : 'border-transparent text-clayton-charcoal-muted hover:text-clayton-charcoal'
          }`}
        >
          <span className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5" />
            <span>Business & Villa</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`px-4 py-2.5 border-b-2 font-medium transition-all ${
            activeTab === 'booking'
              ? 'border-clayton-green text-clayton-charcoal font-bold'
              : 'border-transparent text-clayton-charcoal-muted hover:text-clayton-charcoal'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Booking & Capacity</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 border-b-2 font-medium transition-all ${
            activeTab === 'notifications'
              ? 'border-clayton-green text-clayton-charcoal font-bold'
              : 'border-transparent text-clayton-charcoal-muted hover:text-clayton-charcoal'
          }`}
        >
          <span className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </span>
        </button>

        <Link
          to="/admin/admins"
          className="px-4 py-2.5 border-b-2 border-transparent font-medium text-clayton-charcoal-muted hover:text-clayton-charcoal inline-flex items-center gap-2"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Admin Access →</span>
        </Link>

        <Link
          to="/admin/settings/account"
          className="px-4 py-2.5 border-b-2 border-transparent font-medium text-clayton-charcoal-muted hover:text-clayton-charcoal inline-flex items-center gap-2"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>My Account →</span>
        </Link>
      </div>

      {/* ================= TAB 1: BUSINESS & VILLA ================= */}
      {activeTab === 'business' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-clayton-border shadow-warm-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-clayton-border text-lg font-semibold text-clayton-charcoal">
              <Building className="w-5 h-5 text-clayton-green" />
              <span>Public Identity & Contact</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  District & City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-clayton text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Public Inquiries Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-clayton text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="input-clayton text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Visiting & Studio Hours
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-clayton-border flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs !py-2.5 !px-5 gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Business Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= TAB 2: BOOKING & CAPACITY ================= */}
      {activeTab === 'booking' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-clayton-border shadow-warm-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-clayton-border text-lg font-semibold text-clayton-charcoal">
              <Sliders className="w-5 h-5 text-clayton-green" />
              <span>Booking Rules & Capacity Limits</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Default Workshop Seat Limit
                </label>
                <input
                  type="number"
                  min={4}
                  max={20}
                  value={defaultCapacity}
                  onChange={(e) => setDefaultCapacity(e.target.value)}
                  className="input-clayton text-xs font-mono w-32"
                />
                <span className="text-[10px] text-clayton-charcoal-muted mt-1 block">
                  Recommended: 8–12 guests per mentor for wheel & painting stations.
                </span>
              </div>

              <div className="space-y-3">
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal">
                  Payment Configuration
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowCashOnArrival}
                    onChange={(e) => setAllowCashOnArrival(e.target.checked)}
                    className="rounded border-clayton-border text-clayton-green focus:ring-0"
                  />
                  <span>Allow Pay at Villa Reception (Cash / POS / InstaPay)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoApproveBookings}
                    onChange={(e) => setAutoApproveBookings(e.target.checked)}
                    className="rounded border-clayton-border text-clayton-green focus:ring-0"
                  />
                  <span>Instant seat reservation without manual staff approval</span>
                </label>
              </div>

              <div className="col-span-full">
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Cancellation Policy Text (Shown on public ticket)
                </label>
                <textarea
                  rows={4}
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-clayton-border flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs !py-2.5 !px-5 gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Booking Rules'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= TAB 3: NOTIFICATIONS ================= */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-clayton-border shadow-warm-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-clayton-border text-lg font-semibold text-clayton-charcoal">
              <Bell className="w-5 h-5 text-clayton-green" />
              <span>Notification Preferences</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-clayton-charcoal mb-1">
                  Staff Alert Email
                </label>
                <input
                  type="email"
                  value={staffNotificationEmail}
                  onChange={(e) => setStaffNotificationEmail(e.target.value)}
                  className="input-clayton text-xs font-mono max-w-md"
                />
                <span className="text-[10px] text-clayton-charcoal-muted mt-1 block">
                  New reservations and private salon inquiries will be copied here.
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyStaffOnBooking}
                    onChange={(e) => setNotifyStaffOnBooking(e.target.checked)}
                    className="rounded border-clayton-border text-clayton-green focus:ring-0"
                  />
                  <span>Dispatch email alert to staff on new workshop booking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCustomerConfirmation}
                    onChange={(e) => setNotifyCustomerConfirmation(e.target.checked)}
                    className="rounded border-clayton-border text-clayton-green focus:ring-0"
                  />
                  <span>Automatically send booking confirmation email to customer</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-clayton-border flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs !py-2.5 !px-5 gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Notification Preferences'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Developer / Data Maintenance Tools */}
      <div className="bg-white rounded-2xl p-6 border border-clayton-border space-y-3">
        <h3 className="text-base font-semibold text-clayton-charcoal">
          Studio Data Maintenance
        </h3>
        <p className="text-xs text-clayton-charcoal-muted leading-relaxed">
          Need to test the application in a clean state? You can reload the curated seed catalog (Aswan pottery, botanical cyanotype, oil impasto, stained glass) along with demo reservations.
        </p>
        <button
          type="button"
          onClick={handleResetSeed}
          className="btn-secondary text-xs !py-2 !px-3 text-red-700 hover:bg-red-50 gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Original Demo Seed Data</span>
        </button>
      </div>
    </div>
  );
};
