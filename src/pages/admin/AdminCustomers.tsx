import React, { useEffect, useState } from 'react';
import { Customer, Booking } from '../../types';
import { customerService } from '../../services/customerService';
import { bookingService } from '../../services/bookingService';
import { formatEGP, formatEgyptianPhone, formatSessionDate } from '../../utils/formatters';
import { Users, Search, Mail, Phone, Calendar, History, X } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [cList, bList] = await Promise.all([
          customerService.getCustomers(),
          bookingService.getBookings()
        ]);
        setCustomers(cList);
        setBookings(bList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  const customerBookings = selectedCustomer
    ? bookings.filter((b) => b.customerId === selectedCustomer.id || b.customer?.email === selectedCustomer.email)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
            Customer Directory
          </h1>
          <p className="text-xs text-clayton-charcoal-muted mt-1">
            Guest directory, workshop visit frequency, and booking history.
          </p>
        </div>

        <div className="text-xs text-clayton-charcoal-muted">
          Total Guests: <strong className="text-clayton-charcoal">{customers.length}</strong>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-clayton-border shadow-warm-sm max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-clayton-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-clayton !pl-9 !py-2 text-xs"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-clayton-border shadow-warm-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-clayton-umber-muted">Loading guest directory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-clayton-umber-muted text-sm">
            No guests found matching the search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-clayton-parchment/70 border-b border-clayton-border text-clayton-umber font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-5">Guest Name</th>
                  <th className="py-4 px-5">Email</th>
                  <th className="py-4 px-5">Phone</th>
                  <th className="py-4 px-5 text-center">Bookings</th>
                  <th className="py-4 px-5">Total Spent</th>
                  <th className="py-4 px-5">Notes</th>
                  <th className="py-4 px-5 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clayton-border/70">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-clayton-parchment/40 transition-colors">
                    <td className="py-4.5 px-5 font-medium text-clayton-umber">
                      {c.fullName}
                    </td>
                    <td className="py-4.5 px-5 text-clayton-umber-muted font-sans">
                      {c.email}
                    </td>
                    <td className="py-4.5 px-5 text-clayton-umber-muted font-mono text-[11px]">
                      {formatEgyptianPhone(c.phone)}
                    </td>
                    <td className="py-4.5 px-5 text-center font-mono font-medium text-clayton-olive">
                      {c.totalBookings}
                    </td>
                    <td className="py-4.5 px-5 font-mono font-medium text-clayton-umber">
                      {formatEGP(c.totalSpentEgp)}
                    </td>
                    <td className="py-4.5 px-5 text-clayton-umber-muted max-w-[220px] truncate">
                      {c.notes || '—'}
                    </td>
                    <td className="py-4.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-lg border border-clayton-border text-clayton-umber/80 hover:text-clayton-green hover:border-clayton-green transition-colors text-xs font-mono inline-flex items-center gap-1.5"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Booking History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-clayton-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-clayton-border shadow-warm-xl space-y-5 relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-clayton-charcoal-muted hover:text-clayton-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-clayton-green font-semibold">
                Customer Record
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-clayton-charcoal">
                {selectedCustomer.fullName}
              </h2>
              <p className="text-xs text-clayton-charcoal-muted">
                {selectedCustomer.email} • {formatEgyptianPhone(selectedCustomer.phone)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-clayton-linen border border-clayton-border flex items-center justify-between text-xs">
              <div>
                <span className="text-clayton-charcoal-muted block">Total Reservations</span>
                <span className="font-bold text-clayton-charcoal text-base">
                  {customerBookings.length}
                </span>
              </div>
              <div className="text-right">
                <span className="text-clayton-charcoal-muted block">Cumulative Spend</span>
                <span className="font-bold text-clayton-green text-base">
                  {formatEGP(selectedCustomer.totalSpentEgp)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-clayton-charcoal">
                Past Reservations
              </h3>
              {customerBookings.length === 0 ? (
                <p className="text-xs text-clayton-charcoal-muted">No past bookings found.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {customerBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl border border-clayton-border bg-white text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-clayton-green block">
                          {b.bookingNumber}
                        </span>
                        <span className="font-medium text-clayton-charcoal">
                          {b.workshop?.title || 'Workshop'}
                        </span>
                        <span className="text-[11px] text-clayton-charcoal-muted block">
                          {b.attendeesCount} guest{b.attendeesCount > 1 ? 's' : ''} • {formatEGP(b.totalAmountEgp)}
                        </span>
                      </div>
                      <span className="badge-tag bg-clayton-olive-light text-clayton-olive">
                        {b.bookingStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
