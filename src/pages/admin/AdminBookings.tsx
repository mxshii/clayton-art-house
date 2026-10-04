import React, { useEffect, useState } from 'react';
import { Booking, BookingStatus, PaymentStatus } from '../../types';
import { bookingService } from '../../services/bookingService';
import {
  formatEGP,
  formatSessionDate,
  formatTimeRange,
  formatEgyptianPhone
} from '../../utils/formatters';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  CreditCard,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');

  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: BookingStatus,
    paymentStatus?: PaymentStatus
  ) => {
    try {
      if (newStatus === 'cancelled') {
        const confirmCancel = window.confirm(
          'Are you sure you want to cancel this booking? This will immediately restore the reserved seats to the session capacity.'
        );
        if (!confirmCancel) return;
        await bookingService.cancelBooking(bookingId, 'Admin cancelled from dashboard');
      } else {
        await bookingService.updateBookingStatus(bookingId, newStatus, paymentStatus);
      }

      setActionSuccess(`Booking updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
      loadBookings();
      if (activeBooking?.id === bookingId) {
        setActiveBooking(null);
      }
    } catch (err: any) {
      alert(`Error updating booking: ${err.message}`);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || b.paymentStatus === paymentFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.bookingNumber.toLowerCase().includes(q) ||
      (b.customer?.fullName || '').toLowerCase().includes(q) ||
      (b.customer?.email || '').toLowerCase().includes(q) ||
      (b.customer?.phone || '').includes(q) ||
      (b.workshop?.title || '').toLowerCase().includes(q);

    return matchesStatus && matchesPayment && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
            Bookings Management
          </h1>
          <p className="text-xs text-clayton-charcoal-muted mt-1">
            Review guest reservations, adjust attendance states, and process venue check-ins.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="btn-secondary text-xs !py-2 !px-3.5"
        >
          Refresh Data
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-clayton-olive-light border border-clayton-olive/30 text-clayton-olive text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-clayton-border shadow-warm-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-clayton-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, booking ref, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-clayton !pl-9 !py-2 text-xs w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-clayton-charcoal-muted whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="input-clayton !py-2 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No-Show</option>
          </select>
        </div>

        {/* Payment Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-clayton-charcoal-muted whitespace-nowrap">Payment:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
            className="input-clayton !py-2 text-xs"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="unpaid">Unpaid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-clayton-border shadow-warm-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-clayton-umber-muted">Loading reservations...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 text-center text-clayton-umber-muted text-sm space-y-2">
            <p>No reservations matching the active filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-clayton-parchment/70 border-b border-clayton-border text-clayton-umber font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-5">Booking Ref</th>
                  <th className="py-4 px-5">Customer</th>
                  <th className="py-4 px-5">Contact</th>
                  <th className="py-4 px-5">Workshop & Date</th>
                  <th className="py-4 px-3 text-center">Guests</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Payment</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clayton-border/70">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-clayton-parchment/40 transition-colors">
                    {/* Ref */}
                    <td className="py-4.5 px-5">
                      <span className="font-mono font-bold text-clayton-green">
                        {b.bookingNumber}
                      </span>
                      <span className="block font-mono text-[10px] text-clayton-umber-muted mt-0.5">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4.5 px-5 font-medium text-clayton-umber">
                      {b.customer?.fullName || 'Valued Guest'}
                    </td>

                    {/* Contact */}
                    <td className="py-4.5 px-5 space-y-0.5">
                      <span className="block font-sans text-clayton-umber">{b.customer?.email}</span>
                      <span className="block font-mono text-[11px] text-clayton-umber-muted">
                        {b.customer?.phone ? formatEgyptianPhone(b.customer.phone) : '—'}
                      </span>
                    </td>

                    {/* Workshop & Date */}
                    <td className="py-4.5 px-5 space-y-0.5 max-w-[220px] truncate">
                      <span className="text-sm font-medium text-clayton-umber block truncate">
                        {b.workshop?.title || 'Workshop'}
                      </span>
                      {b.session && (
                        <span className="block text-[11px] text-clayton-umber-muted">
                          {formatSessionDate(b.session.startTime)}
                        </span>
                      )}
                    </td>

                    {/* Attendees */}
                    <td className="py-4.5 px-3 text-center font-medium text-clayton-umber">
                      {b.attendeesCount}
                    </td>

                    {/* Amount */}
                    <td className="py-4.5 px-5 font-medium text-clayton-umber">
                      {formatEGP(b.totalAmountEgp)}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4.5 px-5">
                      <span
                        className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded border ${
                          b.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                            : b.paymentStatus === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                            : 'bg-rose-50 text-rose-800 border-rose-200/80'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    {/* Booking Status */}
                    <td className="py-4.5 px-5">
                      <span
                        className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded border ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                            : b.bookingStatus === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200/80'
                            : b.bookingStatus === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                            : 'bg-clayton-parchment text-clayton-umber-muted border-clayton-border'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveBooking(b)}
                          className="p-1.5 rounded-lg text-clayton-umber-muted hover:text-clayton-umber hover:bg-clayton-parchment"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {b.bookingStatus !== 'confirmed' && b.bookingStatus !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                            title="Confirm Booking"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {b.bookingStatus !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
                            title="Cancel Booking & Release Seats"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 bg-clayton-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-clayton-border shadow-warm-xl space-y-6 relative">
            <button
              onClick={() => setActiveBooking(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-clayton-charcoal-muted hover:text-clayton-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-clayton-green font-semibold">
                Booking Information
              </span>
              <h3 className="text-2xl font-bold text-clayton-charcoal">
                {activeBooking.bookingNumber}
              </h3>
              <p className="text-xs text-clayton-charcoal-muted">
                Pass Code: {activeBooking.confirmationCode}
              </p>
            </div>

            <div className="space-y-3 text-xs bg-clayton-linen p-4 rounded-2xl border border-clayton-border">
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Customer:</span>
                <span className="font-semibold text-clayton-charcoal">{activeBooking.customer?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Email:</span>
                <span>{activeBooking.customer?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Phone:</span>
                <span>{activeBooking.customer?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Workshop:</span>
                <span className="font-semibold text-clayton-charcoal">{activeBooking.workshop?.title}</span>
              </div>
              {activeBooking.session && (
                <div className="flex justify-between">
                  <span className="text-clayton-charcoal-muted">Date:</span>
                  <span>{formatSessionDate(activeBooking.session.startTime)} ({formatTimeRange(activeBooking.session.startTime, activeBooking.session.endTime)})</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Guests:</span>
                <span>{activeBooking.attendeesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Total Amount:</span>
                <span className="font-bold text-clayton-green">{formatEGP(activeBooking.totalAmountEgp)}</span>
              </div>
              {activeBooking.specialRequests && (
                <div className="pt-2 border-t border-clayton-border/60">
                  <span className="text-clayton-charcoal-muted block mb-1">Special Requests:</span>
                  <p className="text-clayton-charcoal italic">{activeBooking.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Quick Status Adjustments */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-clayton-charcoal block">Change Booking State:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleUpdateStatus(activeBooking.id, 'confirmed', 'paid')}
                  className="px-3 py-2 rounded-xl bg-clayton-olive-light text-clayton-olive text-xs font-medium hover:bg-clayton-olive hover:text-white transition-colors"
                >
                  Mark Paid & Confirmed
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeBooking.id, 'completed')}
                  className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeBooking.id, 'no_show')}
                  className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-600 hover:text-white transition-colors"
                >
                  Mark No-Show
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeBooking.id, 'cancelled')}
                  className="px-3 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-medium hover:bg-red-600 hover:text-white transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
