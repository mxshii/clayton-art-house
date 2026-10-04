import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Booking, Session, Workshop } from '../../types';
import { bookingService } from '../../services/bookingService';
import { sessionService } from '../../services/sessionService';
import { workshopService } from '../../services/workshopService';
import {
  formatEGP,
  formatSessionDate,
  formatTimeRange,
  formatEgyptianPhone
} from '../../utils/formatters';
import {
  CalendarDays,
  Users,
  Coins,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [bList, sList, wList] = await Promise.all([
          bookingService.getBookings(),
          sessionService.getSessions(),
          workshopService.getWorkshops(false)
        ]);
        setBookings(bList);
        setSessions(sList);
        setWorkshops(wList);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Compute Metrics
  const todayStr = new Date().toISOString().split('T')[0];

  const todayBookings = bookings.filter((b) => b.createdAt.startsWith(todayStr));
  const pendingBookings = bookings.filter((b) => b.bookingStatus === 'pending');
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'confirmed');

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmountEgp, 0);

  const upcomingSessions = sessions
    .filter((s) => s.status !== 'cancelled' && new Date(s.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Attendees expected today across all today's sessions
  const todaySessions = sessions.filter((s) => s.startTime.startsWith(todayStr));
  const todayAttendees = todaySessions.reduce((sum, s) => sum + s.bookedSeats, 0);

  // Overall Occupancy Rate
  const totalCapacity = sessions.reduce((sum, s) => sum + s.capacity, 0);
  const totalBookedSeats = sessions.reduce((sum, s) => sum + s.bookedSeats, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white rounded-xl w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-clayton-border" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
            Dashboard Overview
          </h1>
          <p className="text-xs text-clayton-charcoal-muted mt-1">
            Real-time workshop bookings, occupancy, and session operations for Clayton Kafr Abdo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/sessions"
            className="btn-secondary text-xs !py-2.5 !px-4 gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-clayton-green" />
            <span>Schedule Session</span>
          </Link>
          <Link
            to="/admin/bookings"
            className="btn-primary text-xs !py-2.5 !px-4 gap-1.5"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>All Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid - Comfortable 4-Card Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Today's Activity */}
        <div className="bg-white p-6 rounded-2xl border border-clayton-border shadow-warm-sm space-y-3">
          <div className="flex items-center justify-between text-clayton-umber-muted">
            <span className="font-mono text-xs uppercase tracking-wider">Today's Activity</span>
            <Users className="w-4 h-4 text-clayton-green" />
          </div>
          <div>
            <span className="text-3xl font-bold text-clayton-umber block">
              {todayAttendees} <span className="text-base font-normal text-clayton-umber-muted">guests</span>
            </span>
            <p className="text-xs text-clayton-umber-muted mt-1">
              {todayBookings.length} booking{todayBookings.length === 1 ? '' : 's'} across {todaySessions.length} studio session{todaySessions.length === 1 ? '' : 's'} today
            </p>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-clayton-border shadow-warm-sm space-y-3">
          <div className="flex items-center justify-between text-clayton-umber-muted">
            <span className="font-mono text-xs uppercase tracking-wider">Paid Revenue</span>
            <Coins className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <span className="text-3xl font-bold text-clayton-umber block">
              {formatEGP(totalRevenue)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed & collected funds</span>
            </div>
          </div>
        </div>

        {/* Card 3: Upcoming Sessions & Occupancy */}
        <div className="bg-white p-6 rounded-2xl border border-clayton-border shadow-warm-sm space-y-3">
          <div className="flex items-center justify-between text-clayton-umber-muted">
            <span className="font-mono text-xs uppercase tracking-wider">Studio Capacity</span>
            <Calendar className="w-4 h-4 text-clayton-green" />
          </div>
          <div>
            <span className="text-3xl font-bold text-clayton-umber block">
              {occupancyRate}% <span className="text-base font-normal text-clayton-umber-muted">occupancy</span>
            </span>
            <p className="text-xs text-clayton-umber-muted mt-1">
              {upcomingSessions.length} upcoming sessions ({totalBookedSeats} of {totalCapacity} seats booked)
            </p>
          </div>
        </div>

        {/* Card 4: Action Needed / Pending */}
        <div className="bg-white p-6 rounded-2xl border border-clayton-border shadow-warm-sm space-y-3">
          <div className="flex items-center justify-between text-clayton-umber-muted">
            <span className="font-mono text-xs uppercase tracking-wider">Attention Needed</span>
            <AlertCircle className={`w-4 h-4 ${pendingBookings.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${pendingBookings.length > 0 ? 'text-amber-800' : 'text-clayton-umber'}`}>
                {pendingBookings.length}
              </span>
              <span className="text-sm font-normal text-clayton-umber-muted">pending</span>
            </div>
            <p className="text-xs text-clayton-umber-muted mt-1">
              {pendingBookings.length > 0
                ? 'Reservations awaiting payment / verification'
                : 'All reservations are up to date'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Sessions & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upcoming Sessions Live Occupancy */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-clayton-border shadow-warm-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-clayton-border">
            <div>
              <h2 className="text-lg font-bold text-clayton-umber">
                Upcoming Studio Sessions
              </h2>
              <p className="text-xs text-clayton-umber-muted mt-0.5">
                Session dates, confirmed headcount, and open easels
              </p>
            </div>
            <Link
              to="/admin/sessions"
              className="text-xs font-mono font-medium text-clayton-green hover:underline"
            >
              Manage all →
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingSessions.slice(0, 5).map((s) => {
              const remaining = s.capacity - s.bookedSeats;
              const percent = Math.round((s.bookedSeats / s.capacity) * 100);
              const workshopName =
                workshops.find((w) => w.id === s.workshopId)?.title || s.workshop?.title || 'Workshop';

              return (
                <div key={s.id} className="p-4 rounded-xl bg-clayton-parchment/60 border border-clayton-border/70 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-clayton-umber line-clamp-1">
                        {workshopName}
                      </h4>
                      <p className="text-xs text-clayton-umber-muted mt-0.5">
                        {formatSessionDate(s.startTime)} • {formatTimeRange(s.startTime, s.endTime)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-medium text-clayton-umber block">
                        {s.bookedSeats} / {s.capacity} seats
                      </span>
                      <span className={`text-[11px] font-mono ${remaining === 0 ? 'text-amber-800' : 'text-clayton-umber-muted'}`}>
                        {remaining === 0 ? 'Fully Booked' : `${remaining} available`}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-clayton-border/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        percent >= 100
                          ? 'bg-amber-700'
                          : percent >= 70
                          ? 'bg-clayton-ochre'
                          : 'bg-clayton-green'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Bookings Table */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-clayton-border shadow-warm-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-clayton-border">
            <div>
              <h2 className="text-lg font-bold text-clayton-umber">
                Recent Reservations
              </h2>
              <p className="text-xs text-clayton-umber-muted mt-0.5">
                Latest guest reservations received
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-mono font-medium text-clayton-green hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-clayton-border/70 flex items-center justify-between gap-3 text-xs hover:bg-clayton-parchment/40 transition-colors"
              >
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-clayton-green">
                      {b.bookingNumber}
                    </span>
                    <span className="font-medium text-clayton-umber truncate">
                      {b.customer?.fullName || 'Guest'}
                    </span>
                  </div>
                  <p className="text-clayton-umber-muted truncate">
                    {b.workshop?.title || 'Workshop'} • {b.attendeesCount} guest{b.attendeesCount > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="text-right shrink-0 space-y-1.5">
                  <span className="font-medium text-clayton-umber block">
                    {formatEGP(b.totalAmountEgp)}
                  </span>
                  <span
                    className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded border ${
                      b.bookingStatus === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                        : b.bookingStatus === 'cancelled'
                        ? 'bg-rose-50 text-rose-800 border-rose-200/80'
                        : 'bg-amber-50 text-amber-800 border-amber-200/80'
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
