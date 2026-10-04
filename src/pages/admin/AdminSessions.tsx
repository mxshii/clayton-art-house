import React, { useEffect, useState } from 'react';
import { Session, Workshop } from '../../types';
import { sessionService } from '../../services/sessionService';
import { workshopService } from '../../services/workshopService';
import {
  formatSessionDate,
  formatTimeRange,
  formatEGP
} from '../../utils/formatters';
import {
  Plus,
  Clock,
  Calendar,
  Users,
  Edit2,
  Trash2,
  XCircle,
  CheckCircle2,
  X
} from 'lucide-react';

export const AdminSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Form
  const [workshopId, setWorkshopId] = useState('');
  const [date, setDate] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('17:00');
  const [endTimeStr, setEndTimeStr] = useState('19:30');
  const [capacity, setCapacity] = useState(10);
  const [instructor, setInstructor] = useState('Nour El-Din');
  const [room, setRoom] = useState('Clayton Courtyard Studio');
  const [notes, setNotes] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [sList, wList] = await Promise.all([
        sessionService.getSessions(),
        workshopService.getWorkshops(false)
      ]);
      setSessions(sList.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
      setWorkshops(wList);
      if (wList.length > 0 && !workshopId) {
        setWorkshopId(wList[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateModal = () => {
    setEditingSession(null);
    if (workshops.length > 0) setWorkshopId(workshops[0].id);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    setDate(tomorrow.toISOString().split('T')[0]);
    setStartTimeStr('17:00');
    setEndTimeStr('19:30');
    setCapacity(10);
    setInstructor('Nour El-Din');
    setRoom('Clayton Courtyard Studio');
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (s: Session) => {
    setEditingSession(s);
    setWorkshopId(s.workshopId);
    setDate(s.startTime.split('T')[0]);
    const startD = new Date(s.startTime);
    const endD = new Date(s.endTime);
    setStartTimeStr(`${String(startD.getHours()).padStart(2, '0')}:${String(startD.getMinutes()).padStart(2, '0')}`);
    setEndTimeStr(`${String(endD.getHours()).padStart(2, '0')}:${String(endD.getMinutes()).padStart(2, '0')}`);
    setCapacity(s.capacity);
    setInstructor(s.instructorName || '');
    setRoom(s.roomOrSpace || 'Main Studio');
    setNotes(s.notes || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const startIso = new Date(`${date}T${startTimeStr}:00`).toISOString();
    const endIso = new Date(`${date}T${endTimeStr}:00`).toISOString();

    try {
      if (editingSession) {
        await sessionService.updateSession(editingSession.id, {
          startTime: startIso,
          endTime: endIso,
          capacity: Number(capacity),
          instructorName: instructor,
          roomOrSpace: room,
          notes
        });
      } else {
        await sessionService.createSession({
          workshopId,
          startTime: startIso,
          endTime: endIso,
          capacity: Number(capacity),
          instructorName: instructor,
          roomOrSpace: room,
          notes
        });
      }

      setModalOpen(false);
      load();
    } catch (err: any) {
      alert(`Error saving session: ${err.message}`);
    }
  };

  const handleCancelSession = async (id: string) => {
    if (window.confirm('Cancel this session? Registered guests should be notified.')) {
      await sessionService.updateSession(id, { status: 'cancelled' });
      load();
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('Delete this session permanently?')) {
      await sessionService.deleteSession(id);
      load();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
            Session Management
          </h1>
          <p className="text-xs text-clayton-charcoal-muted mt-1">
            Schedule workshops, monitor booked seats, and adjust studio capacities.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary text-xs !py-2.5 !px-4 gap-2">
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-2xl border border-clayton-border shadow-warm-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-clayton-umber-muted">Loading schedule...</div>
        ) : sessions.length === 0 ? (
          <div className="p-16 text-center text-clayton-umber-muted text-sm">
            No sessions scheduled yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-clayton-parchment/70 border-b border-clayton-border text-clayton-umber font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-5">Workshop</th>
                  <th className="py-4 px-5">Date & Time</th>
                  <th className="py-4 px-5">Instructor & Studio</th>
                  <th className="py-4 px-5 text-center">Booked / Total</th>
                  <th className="py-4 px-5 text-center">Remaining Seats</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clayton-border/70">
                {sessions.map((s) => {
                  const workshopInfo =
                    workshops.find((w) => w.id === s.workshopId) || s.workshop;
                  const remaining = s.capacity - s.bookedSeats;
                  const isFull = s.status === 'full' || remaining <= 0;

                  return (
                    <tr key={s.id} className="hover:bg-clayton-parchment/40 transition-colors">
                      {/* Workshop Title */}
                      <td className="py-4.5 px-5 max-w-[220px]">
                        <span className="text-sm font-medium text-clayton-umber block truncate">
                          {workshopInfo?.title || 'Workshop'}
                        </span>
                        <span className="font-mono text-[10px] text-clayton-green uppercase tracking-wider">
                          {workshopInfo?.category}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4.5 px-5 space-y-0.5">
                        <span className="font-medium text-clayton-umber block">
                          {formatSessionDate(s.startTime)}
                        </span>
                        <span className="font-mono text-[11px] text-clayton-umber-muted block">
                          {formatTimeRange(s.startTime, s.endTime)}
                        </span>
                      </td>

                      {/* Instructor & Room */}
                      <td className="py-4.5 px-5 space-y-0.5">
                        <span className="font-medium text-clayton-umber block">
                          {s.instructorName || 'Resident Artist'}
                        </span>
                        <span className="text-[11px] text-clayton-umber-muted block">
                          {s.roomOrSpace || 'Main Studio'}
                        </span>
                      </td>

                      {/* Booked / Total */}
                      <td className="py-4.5 px-5 text-center font-mono font-medium text-clayton-umber">
                        {s.bookedSeats} / {s.capacity}
                      </td>

                      {/* Remaining Seats */}
                      <td className="py-4.5 px-5 text-center">
                        <span
                          className={`font-mono text-xs ${
                            remaining <= 0
                              ? 'text-rose-800'
                              : remaining <= 3
                              ? 'text-amber-800 font-semibold'
                              : 'text-clayton-olive'
                          }`}
                        >
                          {remaining <= 0 ? 'Full (0)' : `${remaining} available`}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4.5 px-5">
                        <span
                          className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded border ${
                            s.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-200/80'
                              : isFull
                              ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 rounded-lg text-clayton-charcoal-muted hover:text-clayton-charcoal hover:bg-clayton-sand-light"
                            title="Edit Session"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {s.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelSession(s.id)}
                              className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50"
                              title="Cancel Session"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSession(s.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Create / Edit Session Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-clayton-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-clayton-border shadow-warm-xl space-y-5 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-clayton-charcoal-muted hover:text-clayton-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-clayton-charcoal">
                {editingSession ? 'Edit Session' : 'Schedule New Session'}
              </h2>
              <p className="text-xs text-clayton-charcoal-muted mt-0.5">
                Set date, studio hours, and maximum seating capacity.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {!editingSession && (
                <div>
                  <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                    Select Workshop *
                  </label>
                  <select
                    value={workshopId}
                    onChange={(e) => setWorkshopId(e.target.value)}
                    className="input-clayton text-xs"
                    required
                  >
                    {workshops.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.title} ({formatEGP(w.priceEgp)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Session Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={startTimeStr}
                    onChange={(e) => setStartTimeStr(e.target.value)}
                    className="input-clayton text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={endTimeStr}
                    onChange={(e) => setEndTimeStr(e.target.value)}
                    className="input-clayton text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                    Total Capacity *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="input-clayton text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="input-clayton text-xs"
                    placeholder="e.g. Nour El-Din"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Studio Space / Room
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="input-clayton text-xs"
                  placeholder="e.g. Clayton Courtyard Studio"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Session Notes (Internal)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-clayton text-xs"
                  placeholder="e.g. Wheel focus + candlelit ambiance"
                />
              </div>

              <div className="pt-4 border-t border-clayton-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs !py-2 !px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs !py-2 !px-5">
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
