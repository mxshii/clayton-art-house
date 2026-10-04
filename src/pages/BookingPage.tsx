import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Session, Workshop, BookingCreationResult } from '../types';
import { workshopService } from '../services/workshopService';
import { sessionService } from '../services/sessionService';
import { bookingService } from '../services/bookingService';
import { isPaymentTestMode } from '../services/paymentService';
import {
  formatEGP,
  formatSessionDate,
  formatTimeRange,
  formatEgyptianPhone,
  formatDuration
} from '../utils/formatters';
import {
  Calendar,
  Clock,
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Building,
  ShieldCheck,
  QrCode,
  Download,
  User,
  Mail,
  Phone
} from 'lucide-react';

type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const preselectedSessionId = searchParams.get('sessionId');
  const preselectedWorkshopId = searchParams.get('workshopId');

  // Multi-step State
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [attendeesCount, setAttendeesCount] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingCreationResult | null>(null);

  // Load workshops and sessions
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [wList, sList] = await Promise.all([
          workshopService.getWorkshops(true),
          sessionService.getSessions()
        ]);
        setWorkshops(wList);

        const futureSessions = sList
          .filter((s) => s.status !== 'cancelled' && new Date(s.startTime) > new Date())
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        setSessions(futureSessions);

        // Preselection handling
        if (preselectedSessionId) {
          const matchedSession = futureSessions.find((s) => s.id === preselectedSessionId);
          if (matchedSession) {
            setSelectedSessionId(matchedSession.id);
            setSelectedWorkshopId(matchedSession.workshopId);
            setCurrentStep(3); // Jump to choose guests
            return;
          }
        }

        if (preselectedWorkshopId) {
          const matchedWorkshop = wList.find((w) => w.id === preselectedWorkshopId || w.slug === preselectedWorkshopId);
          if (matchedWorkshop) {
            setSelectedWorkshopId(matchedWorkshop.id);
            setCurrentStep(2); // Jump to choose session
            return;
          }
        }

        // Default to first workshop if available
        if (wList.length > 0) {
          setSelectedWorkshopId(wList[0].id);
        }
      } catch (err) {
        console.error('Failed to load atelier booking data:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [preselectedSessionId, preselectedWorkshopId]);

  // Derived current workshop & session
  const currentWorkshop = workshops.find((w) => w.id === selectedWorkshopId) || null;
  const workshopSessions = sessions.filter((s) => s.workshopId === selectedWorkshopId);
  const currentSession = sessions.find((s) => s.id === selectedSessionId) || null;

  const remainingSeats = currentSession
    ? Math.max(0, currentSession.capacity - currentSession.bookedSeats)
    : 0;

  const maxSelectableSeats = Math.min(6, remainingSeats || 1);

  const pricePerPerson = currentWorkshop?.priceEgp || currentSession?.workshop?.priceEgp || 0;
  const totalPrice = pricePerPerson * attendeesCount;

  // Handle Workshop Selection
  const handleSelectWorkshop = (wId: string) => {
    setSelectedWorkshopId(wId);
    setSelectedSessionId(''); // Reset session
    setCurrentStep(2);
  };

  // Handle Session Selection
  const handleSelectSession = (sId: string) => {
    setSelectedSessionId(sId);
    setAttendeesCount(1);
    setCurrentStep(3);
  };

  // Step 4 Validation
  const validateGuestInfo = (): boolean => {
    setErrorMessage(null);
    if (!name.trim()) {
      setErrorMessage('Please enter your full name for the atelier register.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive your admission pass.');
      return false;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      setErrorMessage('Please enter a valid phone number (e.g. 01012345678).');
      return false;
    }
    return true;
  };

  // Submission
  const handleConfirmReservation = async () => {
    if (!currentSession || !currentWorkshop) {
      setErrorMessage('Please select a workshop and session before confirming.');
      return;
    }

    if (!validateGuestInfo()) {
      setCurrentStep(4);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const result = await bookingService.createBooking({
        sessionId: currentSession.id,
        customerName: name.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerPhone: formatEgyptianPhone(phone),
        attendeesCount: attendeesCount,
        specialRequests: specialRequests.trim() || undefined,
        paymentMethod: paymentMethod === 'card' ? 'card' : 'cash'
      });

      if (!result.success || !result.bookingId) {
        throw new Error(result.error || 'Failed to complete atelier reservation.');
      }

      setConfirmation(result);
      setCurrentStep(6); // Step 6: Confirmation Pass
    } catch (err: any) {
      console.error('Booking error:', err);
      setErrorMessage(err.message || 'We could not complete your reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-28 max-w-4xl mx-auto px-4 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-clayton-sand w-64 mx-auto" />
          <div className="h-64 bg-clayton-sand border border-clayton-hairline" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-28 bg-[#F6F3EF] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#577057] block">
            RESERVATIONS
          </span>
          <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#28231F] tracking-tight">
            Book a Workshop
          </h1>
          <p className="text-sm sm:text-base text-[#5C544D] font-normal">
            Choose your workshop, select a date, and reserve your seats.
          </p>
        </div>

        {/* 5-Step Visual Stepper Bar */}
        {currentStep < 6 && (
          <div className="mb-10 border-b border-[#E8E2D6] pb-4">
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-medium">
              {[
                { step: 1, label: '1. Workshop' },
                { step: 2, label: '2. Date & Time' },
                { step: 3, label: '3. Guests' },
                { step: 4, label: '4. Your Details' },
                { step: 5, label: '5. Confirm & Pay' }
              ].map((s) => {
                const isActive = currentStep === s.step;
                const isPast = currentStep > s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => {
                      if (isPast) setCurrentStep(s.step as BookingStep);
                    }}
                    disabled={!isPast && !isActive}
                    className={`py-2 px-1 border-b-2 transition-colors ${
                      isActive
                        ? 'border-[#577057] text-[#577057] font-semibold'
                        : isPast
                        ? 'border-emerald-700 text-emerald-800 cursor-pointer'
                        : 'border-transparent text-[#8C8277]/60 cursor-not-allowed'
                    }`}
                  >
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">0{s.step}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Experience Context Banner (when in steps 2-5) */}
        {currentStep >= 2 && currentStep <= 5 && currentWorkshop && (
          <div className="mb-8 p-4 bg-white border border-[#E8E2D6] rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <img
                src={currentWorkshop.coverImage}
                alt={currentWorkshop.title}
                className="w-12 h-12 object-cover border border-[#E8E2D6] rounded"
              />
              <div>
                <span className="text-[10px] uppercase text-[#577057] tracking-wider block font-semibold">
                  Selected Workshop
                </span>
                <p className="font-montserrat text-base text-[#28231F] font-semibold">{currentWorkshop.title}</p>
                {currentSession && (
                  <p className="text-[#5C544D] text-xs mt-0.5">
                    {formatSessionDate(currentSession.startTime)} • {formatTimeRange(currentSession.startTime, currentSession.endTime)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Price</span>
                <span className="font-montserrat text-lg text-[#28231F] font-semibold">{formatEGP(totalPrice)}</span>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-[#577057] hover:underline text-xs font-semibold"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: CHOOSE WORKSHOP ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
              <h2 className="font-montserrat text-2xl font-semibold text-[#28231F]">Step 1: Choose a Workshop</h2>
              <span className="text-xs text-[#5C544D]">{workshops.length} workshops available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((w) => {
                const isSelected = w.id === selectedWorkshopId;
                return (
                  <div
                    key={w.id}
                    onClick={() => handleSelectWorkshop(w.id)}
                    className={`cursor-pointer bg-white border transition-all duration-200 flex flex-col justify-between group relative rounded-xl overflow-hidden shadow-sm ${
                      isSelected
                        ? 'border-[#577057] ring-1 ring-[#577057]'
                        : 'border-[#E8E2D6] hover:border-[#577057]/60'
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F4EFE6]">
                      <img
                        src={w.coverImage}
                        alt={w.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-medium uppercase px-2.5 py-0.5 bg-white/95 text-[#28231F] border border-[#E8E2D6] rounded-full">
                          {w.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#28231F] text-white rounded">
                          {formatEGP(w.priceEgp)}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-montserrat text-xl font-semibold text-[#28231F] group-hover:text-[#577057] transition-colors">
                          {w.title}
                        </h3>
                        <p className="text-xs text-[#5C544D] mt-1 line-clamp-2 leading-relaxed">
                          {w.shortDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E8E2D6] flex items-center justify-between text-xs text-[#5C544D]">
                        <span>{formatDuration(w.durationMinutes)}</span>
                        <span className="text-[#577057] font-semibold">
                          Select Workshop →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: CHOOSE DATE & SESSION ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
              <div>
                <h2 className="font-montserrat text-2xl font-semibold text-[#28231F]">Step 2: Select Date & Time</h2>
                <p className="text-xs text-[#5C544D] mt-0.5">
                  Available dates for: <strong className="font-semibold text-[#28231F]">{currentWorkshop?.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-[#577057] hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Workshop</span>
              </button>
            </div>

            {workshopSessions.length === 0 ? (
              <div className="p-12 bg-white border border-[#E8E2D6] text-center space-y-3 rounded-2xl shadow-sm">
                <Calendar className="w-8 h-8 text-[#8C8277] mx-auto opacity-50" />
                <h3 className="font-montserrat text-xl font-semibold text-[#28231F]">No Upcoming Dates Scheduled</h3>
                <p className="text-xs text-[#5C544D] max-w-md mx-auto leading-relaxed">
                  We add new dates weekly. You can choose a different workshop or reach out to request a private date.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="btn-editorial-primary text-xs font-medium"
                  >
                    Select Another Workshop
                  </button>
                  <Link to="/private-events" className="btn-editorial-secondary text-xs font-medium">
                    Private Event Inquiry
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workshopSessions.map((sess) => {
                  const remaining = sess.capacity - sess.bookedSeats;
                  const isFull = sess.status === 'full' || remaining <= 0;
                  const isSelected = sess.id === selectedSessionId;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => !isFull && handleSelectSession(sess.id)}
                      className={`p-5 border transition-all duration-300 flex flex-col justify-between rounded-xl shadow-sm ${
                        isFull
                          ? 'bg-[#F4EFE6]/60 border-[#E8E2D6] opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-white border-[#577057] ring-1 ring-[#577057] cursor-pointer'
                          : 'bg-white border-[#E8E2D6] hover:border-[#577057]/60 cursor-pointer'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6] text-xs">
                          <span className="text-[#5C544D]">Main Studio</span>
                          {isFull ? (
                            <span className="text-rose-800 bg-rose-50 px-2 py-0.5 border border-rose-200 rounded text-[11px] font-medium">
                              Fully Booked
                            </span>
                          ) : (
                            <span className="text-[#4E5F4D] bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded text-[11px] font-medium">
                              {remaining} Seats Available
                            </span>
                          )}
                        </div>

                        <p className="font-montserrat text-lg font-semibold text-[#28231F]">
                          {formatSessionDate(sess.startTime)}
                        </p>

                        <div className="space-y-1 text-xs text-[#5C544D]">
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#577057]" />
                            <span>{formatTimeRange(sess.startTime, sess.endTime)}</span>
                          </p>
                          {sess.instructorName && (
                            <p className="text-xs text-[#8C8277]">
                              Instructor: {sess.instructorName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E8E2D6] mt-4 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#28231F]">
                          {formatEGP(currentWorkshop?.priceEgp || 0)} / person
                        </span>
                        {isFull ? (
                          <span className="text-xs uppercase text-[#8C8277]">Waitlist</span>
                        ) : (
                          <span className="text-xs text-[#577057] font-semibold">
                            Select Session →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: CHOOSE NUMBER OF GUESTS ================= */}
        {currentStep === 3 && currentSession && (
          <div className="bg-white p-8 border border-[#E8E2D6] space-y-8 max-w-2xl mx-auto rounded-2xl shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6]">
              <div>
                <h2 className="font-montserrat text-2xl font-semibold text-[#28231F]">Step 3: Number of Guests</h2>
                <p className="text-xs text-[#5C544D] mt-0.5">
                  How many people will be attending?
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-[#577057] hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Session</span>
              </button>
            </div>

            {/* Counter Section */}
            <div className="flex items-center justify-between p-6 bg-[#F6F3EF] border border-[#E8E2D6] rounded-xl">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#5C544D] block font-medium">
                  Guests
                </span>
                <span className="font-montserrat text-3xl font-semibold text-[#28231F]">
                  {attendeesCount} {attendeesCount === 1 ? 'Guest' : 'Guests'}
                </span>
                <p className="text-xs text-[#4E5F4D] mt-1 font-medium">
                  ({remainingSeats} seats available)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAttendeesCount(Math.max(1, attendeesCount - 1))}
                  disabled={attendeesCount <= 1}
                  className="w-10 h-10 border border-[#E8E2D6] bg-white flex items-center justify-center text-base text-[#28231F] rounded-lg disabled:opacity-40 hover:border-[#577057] shadow-sm font-semibold"
                >
                  -
                </button>
                <span className="text-lg font-bold w-6 text-center text-[#28231F]">
                  {attendeesCount}
                </span>
                <button
                  type="button"
                  onClick={() => setAttendeesCount(Math.min(maxSelectableSeats, attendeesCount + 1))}
                  disabled={attendeesCount >= maxSelectableSeats}
                  className="w-10 h-10 border border-[#E8E2D6] bg-white flex items-center justify-center text-base text-[#28231F] rounded-lg disabled:opacity-40 hover:border-[#577057] shadow-sm font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Preview */}
            <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-between text-xs">
              <div>
                <p className="text-[#5C544D]">
                  {attendeesCount} × {formatEGP(pricePerPerson)}
                </p>
                <p className="font-montserrat text-2xl text-[#28231F] font-semibold mt-1">
                  Total: {formatEGP(totalPrice)}
                </p>
              </div>

              <button
                onClick={() => setCurrentStep(4)}
                className="btn-clayton-green px-6 py-3 text-xs gap-2 font-medium"
              >
                <span>Next: Your Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CUSTOMER INFORMATION ================= */}
        {currentStep === 4 && (
          <div className="bg-white p-8 border border-[#E8E2D6] space-y-8 max-w-2xl mx-auto rounded-2xl shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6]">
              <div>
                <h2 className="font-montserrat text-2xl font-semibold text-[#28231F]">Step 4: Your Details</h2>
                <p className="text-xs text-[#5C544D] mt-0.5">
                  We'll send your booking confirmation and details here.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs text-[#577057] hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (validateGuestInfo()) setCurrentStep(5);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C544D] mb-1.5 font-medium">
                  Full Name <span className="text-[#577057]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C8277] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Layla Mansour"
                    className="input-editorial !pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5C544D] mb-1.5 font-medium">
                    Email Address <span className="text-[#577057]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C8277] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="layla@example.com"
                      className="input-editorial !pl-10 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5C544D] mb-1.5 font-medium">
                    Phone Number <span className="text-[#577057]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C8277] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010 1234 5678"
                      className="input-editorial !pl-10 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C544D] mb-1.5 font-medium">
                  Special Requests <span className="text-[#8C8277] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Celebrating a birthday or any accessibility needs..."
                  className="input-editorial text-sm"
                />
              </div>

              <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-[#5C544D] hover:text-[#28231F] font-medium"
                >
                  ← Edit Guests
                </button>
                <button
                  type="submit"
                  className="btn-clayton-green px-6 py-3 text-xs gap-2 font-medium"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 5: REVIEW & PAYMENT ================= */}
        {currentStep === 5 && currentSession && currentWorkshop && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6]">
              <div>
                <h2 className="font-montserrat text-2xl font-semibold text-[#28231F]">Step 5: Review & Payment</h2>
                <p className="text-xs text-[#5C544D] mt-0.5">
                  Please review your reservation before completing the booking.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(4)}
                className="text-xs text-[#577057] hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>
            </div>

            {/* Reservation Summary */}
            <div className="bg-white p-6 sm:p-8 border border-[#E8E2D6] rounded-2xl shadow-sm space-y-6">
              <div className="flex items-start justify-between pb-6 border-b border-[#E8E2D6]">
                <div>
                  <h3 className="font-montserrat text-2xl font-semibold text-[#28231F]">{currentWorkshop.title}</h3>
                  <p className="text-xs text-[#5C544D] mt-1">
                    Clayton Art House · Kafr Abdo, Alexandria
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Guests</span>
                  <span className="font-montserrat text-xl font-semibold text-[#28231F]">{attendeesCount} {attendeesCount === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5C544D] pb-6 border-b border-[#E8E2D6]">
                <div className="p-3.5 bg-[#F6F3EF] border border-[#E8E2D6] rounded-xl">
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Date</span>
                  <p className="font-medium text-[#28231F] mt-1">{formatSessionDate(currentSession.startTime)}</p>
                </div>
                <div className="p-3.5 bg-[#F6F3EF] border border-[#E8E2D6] rounded-xl">
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Time</span>
                  <p className="font-medium text-[#28231F] mt-1">{formatTimeRange(currentSession.startTime, currentSession.endTime)}</p>
                </div>
                <div className="p-3.5 bg-[#F6F3EF] border border-[#E8E2D6] rounded-xl">
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Name</span>
                  <p className="font-medium text-[#28231F] mt-1 truncate">{name}</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#5C544D] block font-medium">
                  Payment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border cursor-pointer flex items-start gap-3 transition-all rounded-xl ${
                      paymentMethod === 'card'
                        ? 'border-[#577057] bg-[#F6F3EF] ring-1 ring-[#577057]'
                        : 'border-[#E8E2D6] bg-white hover:border-[#577057]/50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#577057] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-montserrat text-base font-semibold text-[#28231F]">Credit / Debit Card</p>
                      <p className="text-xs text-[#5C544D] mt-0.5">
                        {isPaymentTestMode ? 'Paymob Test Gateway (Instant confirmation)' : 'Secure online card payment'}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 border cursor-pointer flex items-start gap-3 transition-all rounded-xl ${
                      paymentMethod === 'cash'
                        ? 'border-[#577057] bg-[#F6F3EF] ring-1 ring-[#577057]'
                        : 'border-[#E8E2D6] bg-white hover:border-[#577057]/50'
                    }`}
                  >
                    <Building className="w-5 h-5 text-[#4E5F4D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-montserrat text-base font-semibold text-[#28231F]">Pay at the Studio</p>
                      <p className="text-xs text-[#5C544D] mt-0.5">
                        Pay with cash, card, or InstaPay when you arrive.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total & Action */}
              <div className="pt-6 border-t border-[#E8E2D6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase text-[#5C544D] block font-medium">Total</span>
                  <span className="font-montserrat text-3xl font-semibold text-[#28231F]">
                    {formatEGP(totalPrice)}
                  </span>
                </div>

                <button
                  onClick={handleConfirmReservation}
                  disabled={submitting}
                  className="btn-clayton-green px-8 py-3.5 text-xs gap-2 font-medium disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Confirming Booking...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 6: BRANDED CONFIRMATION PASS ================= */}
        {currentStep === 6 && confirmation && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            {/* Success Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 text-[#4E5F4D] border border-emerald-200 flex items-center justify-center mx-auto rounded-full">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl font-semibold text-[#28231F]">
                Booking Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-[#5C544D]">
                We've reserved your spot. A confirmation has been sent to <strong>{confirmation.customerEmail || email}</strong>.
              </p>
            </div>

            {/* Booking Pass Card */}
            <div className="bg-white border border-[#E8E2D6] p-8 relative overflow-hidden shadow-sm rounded-2xl">
              {/* Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D6]">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/assets/clayton/logo/Clayton Art House Logo.png"
                    alt="Clayton Art House"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                  <div>
                    <span className="text-[10px] uppercase text-[#577057] tracking-wider block font-semibold">
                      Clayton Art House · Booking Pass
                    </span>
                    <p className="font-montserrat text-xl font-semibold text-[#28231F] mt-0.5">
                      {confirmation.workshopTitle || currentWorkshop?.title}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Booking #</span>
                  <span className="text-xs font-bold text-[#28231F]">{confirmation.bookingNumber || confirmation.confirmationCode}</span>
                </div>
              </div>

              {/* Pass Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[#E8E2D6] text-xs text-[#5C544D]">
                <div>
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Date</span>
                  <p className="font-medium text-[#28231F] mt-1">
                    {confirmation.startTime ? formatSessionDate(confirmation.startTime) : currentSession ? formatSessionDate(currentSession.startTime) : ''}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Time</span>
                  <p className="font-medium text-[#28231F] mt-1">
                    {confirmation.startTime && confirmation.endTime ? formatTimeRange(confirmation.startTime, confirmation.endTime) : currentSession ? formatTimeRange(currentSession.startTime, currentSession.endTime) : ''}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Guests</span>
                  <p className="font-medium text-[#28231F] mt-1">
                    {confirmation.attendeesCount || attendeesCount} {((confirmation.attendeesCount || attendeesCount) === 1) ? 'Guest' : 'Guests'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#8C8277] block font-medium">Total</span>
                  <p className="font-medium text-[#28231F] mt-1">
                    {formatEGP(confirmation.totalAmountEgp || totalPrice)} ({confirmation.paymentStatus || 'confirmed'})
                  </p>
                </div>
              </div>

              {/* Venue & QR Stamp */}
              <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1 text-xs">
                  <p className="font-montserrat text-base font-semibold text-[#28231F]">Clayton Art House</p>
                  <p className="text-xs text-[#5C544D]">14 Ahmed Zulfikar St., Kafr Abdo, Alexandria</p>
                  <p className="text-xs text-[#577057] mt-1 font-medium">
                    Please arrive 10 minutes before your session begins.
                  </p>
                </div>

                <div className="p-3.5 border border-[#E8E2D6] bg-[#F6F3EF] flex items-center gap-3 shrink-0 rounded-xl">
                  <QrCode className="w-10 h-10 text-[#28231F]" />
                  <div className="text-[10px] text-[#5C544D] font-medium leading-tight">
                    <span>CHECK-IN</span>
                    <br />
                    <span>AT STUDIO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => window.print()}
                className="btn-editorial-primary text-xs gap-2 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print or Save Pass</span>
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedSessionId('');
                  setConfirmation(null);
                }}
                className="btn-editorial-secondary text-xs font-medium"
              >
                Book Another Workshop
              </button>
              <Link to="/" className="text-xs text-[#577057] hover:underline font-semibold">
                Return to Home →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
