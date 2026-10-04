import React, { useEffect, useState } from 'react';
import { PrivateEventInquiry, EventInquiryStatus } from '../../types';
import { inquiryService } from '../../services/inquiryService';
import { formatEgyptianPhone } from '../../utils/formatters';
import { MessageSquare, Calendar, Users, Mail, Phone, CheckCircle2, X } from 'lucide-react';

const STATUS_OPTIONS: EventInquiryStatus[] = [
  'new',
  'contacted',
  'quoted',
  'confirmed',
  'archived'
];

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<PrivateEventInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInquiry, setActiveInquiry] = useState<PrivateEventInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await inquiryService.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdateStatus = async (id: string, status: EventInquiryStatus) => {
    await inquiryService.updateInquiryStatus(id, status);
    load();
    if (activeInquiry?.id === id) {
      setActiveInquiry((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleSaveNotes = async () => {
    if (!activeInquiry) return;
    await inquiryService.updateInquiryStatus(activeInquiry.id, activeInquiry.status, adminNotes);
    load();
    setActiveInquiry(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
          Private Event Inquiries
        </h1>
        <p className="text-xs text-clayton-charcoal-muted mt-1">
          Review customized villa buyouts, birthdays, bridal showers, and corporate workshops.
        </p>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-clayton-border shadow-warm-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-clayton-charcoal-muted">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-clayton-charcoal-muted text-sm">
            No private event inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-clayton-linen/80 border-b border-clayton-border text-clayton-charcoal uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Event Type</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Preferred Date</th>
                  <th className="py-3.5 px-3 text-center">Guests</th>
                  <th className="py-3.5 px-4">Budget Range</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clayton-border/60">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-clayton-linen/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-clayton-charcoal">
                      {inq.eventType}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <span className="font-medium text-clayton-charcoal block">{inq.name}</span>
                      <span className="text-[11px] text-clayton-charcoal-muted block">{inq.email}</span>
                      <span className="text-[11px] text-clayton-charcoal-muted block">{formatEgyptianPhone(inq.phone)}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-clayton-charcoal">
                      {inq.preferredDate}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-clayton-charcoal">
                      {inq.guestCount}
                    </td>
                    <td className="py-3.5 px-4 text-clayton-charcoal font-medium">
                      {inq.budgetRange || 'Flexible'}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateStatus(inq.id, e.target.value as EventInquiryStatus)}
                        className={`text-xs rounded-full px-2.5 py-1 border font-medium ${
                          inq.status === 'confirmed'
                            ? 'bg-clayton-olive-light text-clayton-olive border-clayton-olive/30'
                            : inq.status === 'new'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : inq.status === 'quoted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveInquiry(inq);
                          setAdminNotes(inq.adminNotes || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-clayton-sand-light hover:bg-[#577057] hover:text-white transition-colors text-xs font-medium"
                      >
                        View Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail & Admin Notes Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 bg-clayton-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-clayton-border shadow-warm-xl space-y-5 relative">
            <button
              onClick={() => setActiveInquiry(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-clayton-charcoal-muted hover:text-clayton-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs uppercase tracking-wider text-clayton-green font-semibold">
                Event Inquiry Details
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-clayton-charcoal">
                {activeInquiry.eventType}
              </h2>
              <p className="text-xs text-clayton-charcoal-muted mt-0.5">
                From {activeInquiry.name} ({activeInquiry.email} • {formatEgyptianPhone(activeInquiry.phone)})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-clayton-linen border border-clayton-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Target Date:</span>
                <span className="font-semibold text-clayton-charcoal">{activeInquiry.preferredDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Guest Count:</span>
                <span>{activeInquiry.guestCount} guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clayton-charcoal-muted">Budget:</span>
                <span>{activeInquiry.budgetRange || 'Flexible'}</span>
              </div>
              {activeInquiry.notes && (
                <div className="pt-2 border-t border-clayton-border/60">
                  <span className="text-clayton-charcoal-muted block mb-1">Customer Vision:</span>
                  <p className="text-clayton-charcoal leading-relaxed">{activeInquiry.notes}</p>
                </div>
              )}
            </div>

            {/* Admin Notes Editor */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-clayton-charcoal">
                Staff Follow-up Notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log phone calls, quotation proposals, or deposit confirmations..."
                className="input-clayton text-xs"
              />
            </div>

            <div className="pt-4 border-t border-clayton-border flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveInquiry(null)}
                className="btn-secondary text-xs !py-2 !px-4"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="btn-primary text-xs !py-2 !px-5"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
